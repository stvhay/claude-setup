#!/usr/bin/env python3
"""
Hot Tub Maintenance Skill — CHEM and AERATE Test Cases

New test cases for Chemistry Solver (CHEM-001 through CHEM-015) and
Aeration Tracking (AERATE-001 through AERATE-008) requirements.

These tests should be merged into tests/test_skill.py
"""

import unittest
from dataclasses import dataclass
from typing import Dict, List, Tuple, Optional
import math


# =============================================================================
# CHEMISTRY SOLVER SPECIFICATION (CHEM-001, CHEM-002)
# =============================================================================

# CHEM-001: Effect matrix (per unit)
EFFECT_MATRIX = {
    'bisulfate':   {'ph': -0.15, 'ta': -5,  'fac': 0,   'cya': 0,   'salt': 0},
    'carbonate':   {'ph': 0.10,  'ta': 8,   'fac': 0,   'cya': 0,   'salt': 0},
    'bicarbonate': {'ph': 0,     'ta': 7,   'fac': 0,   'cya': 0,   'salt': 0},
    'dichlor':     {'ph': 0,     'ta': 0,   'fac': 1.2, 'cya': 0.9, 'salt': 0},
    'salt':        {'ph': 0,     'ta': 0,   'fac': 0,   'cya': 0,   'salt': 228},
}

# CHEM-002: Operational targets
OPERATIONAL_TARGETS = {
    'ph': 7.2,    # Drifts up, start low
    'ta': 80,     # Per manufacturer
    'fac': 3,     # Standard
    'salt': 1750, # Mid-range
}

# Target ranges (from existing TARGETS)
TARGET_RANGES = {
    'ph': (7.2, 7.8),
    'ta': (40, 120),
    'fac': (1, 5),
    'salt': (1500, 2000),
}


# =============================================================================
# CHEMISTRY SOLVER IMPLEMENTATION (for testing)
# =============================================================================

@dataclass
class ChemSolution:
    """Result of chemistry solver."""
    feasible: bool
    chemicals: Dict[str, float]  # chemical -> amount
    projected: Dict[str, float]  # parameter -> final value
    strategy: str  # 'direct', 'sequential', 'aeration'
    explanation: str


def solve_ph_ta(ph_current: float, ta_current: float) -> ChemSolution:
    """
    CHEM-006: Solve joint pH/TA system.
    
    System:
      ΔpH = -0.15·B + 0.10·C = (7.2 - ph_current)
      ΔTA = -5·B + 8·C + 7·N = (80 - ta_current)
    
    Constraints: B ≥ 0, C ≥ 0, N ≥ 0, only one of B/C non-zero
    """
    ph_target = OPERATIONAL_TARGETS['ph']
    ta_target = OPERATIONAL_TARGETS['ta']
    
    delta_ph = ph_target - ph_current
    delta_ta = ta_target - ta_current
    
    # Case 1: pH needs to go down (use bisulfate)
    if delta_ph < 0:
        B = -delta_ph / 0.15  # bisulfate amount
        ta_effect_from_B = -5 * B
        remaining_ta = delta_ta - ta_effect_from_B
        
        if remaining_ta > 0:
            # Need to raise TA with bicarbonate
            N = remaining_ta / 7
            return ChemSolution(
                feasible=True,
                chemicals={'bisulfate': B, 'bicarbonate': N},
                projected={'ph': ph_target, 'ta': ta_target},
                strategy='direct',
                explanation=f'{B:.1f} TBSP bisulfate + {N:.1f} TBSP bicarbonate'
            )
        elif remaining_ta >= -ta_current + TARGET_RANGES['ta'][0]:
            # TA drop is acceptable (stays in range)
            final_ta = ta_current + ta_effect_from_B
            return ChemSolution(
                feasible=True,
                chemicals={'bisulfate': B},
                projected={'ph': ph_target, 'ta': final_ta},
                strategy='direct',
                explanation=f'{B:.1f} TBSP bisulfate (TA will drop to {final_ta:.0f})'
            )
        else:
            # TA would go too low - need compensation
            # Reduce bisulfate, add bicarbonate to keep TA ≥ 40
            ta_min = TARGET_RANGES['ta'][0]
            # Solve: ta_current - 5B + 7N = ta_min (minimum acceptable)
            # and: -0.15B = delta_ph (pH requirement)
            # This is overdetermined; prioritize not crashing TA
            max_ta_drop = ta_current - ta_min
            max_B = max_ta_drop / 5
            actual_B = min(B, max_B)
            actual_ph = ph_current - 0.15 * actual_B
            ta_after_B = ta_current - 5 * actual_B
            N = max(0, (ta_target - ta_after_B) / 7)
            
            return ChemSolution(
                feasible=True,
                chemicals={'bisulfate': actual_B, 'bicarbonate': N},
                projected={'ph': actual_ph, 'ta': ta_after_B + 7*N},
                strategy='sequential',
                explanation=f'{actual_B:.1f} TBSP bisulfate + {N:.1f} TBSP bicarbonate (limited to protect TA)'
            )
    
    # Case 2: pH needs to go up (use carbonate or aeration)
    elif delta_ph > 0:
        # Check if carbonate is viable
        C = delta_ph / 0.10  # carbonate amount
        ta_effect_from_C = 8 * C
        final_ta = ta_current + ta_effect_from_C
        
        if final_ta <= TARGET_RANGES['ta'][1]:
            # Carbonate works, may need bicarbonate for TA
            remaining_ta = delta_ta - ta_effect_from_C
            if remaining_ta > 0:
                N = remaining_ta / 7
                return ChemSolution(
                    feasible=True,
                    chemicals={'carbonate': C, 'bicarbonate': N},
                    projected={'ph': ph_target, 'ta': ta_target},
                    strategy='direct',
                    explanation=f'{C:.1f} TBSP carbonate + {N:.1f} TBSP bicarbonate'
                )
            else:
                return ChemSolution(
                    feasible=True,
                    chemicals={'carbonate': C},
                    projected={'ph': ph_target, 'ta': final_ta},
                    strategy='direct',
                    explanation=f'{C:.1f} TBSP carbonate'
                )
        else:
            # Carbonate would push TA out of range - need aeration
            # CHEM-009: Aeration required when pH low AND TA high
            return ChemSolution(
                feasible=False,
                chemicals={},
                projected={'ph': ph_current, 'ta': ta_current},
                strategy='aeration',
                explanation='Aeration required: pH low + TA high. Run jets with cover open.'
            )
    
    # Case 3: pH is on target, just adjust TA
    else:
        if delta_ta > 0:
            N = delta_ta / 7
            return ChemSolution(
                feasible=True,
                chemicals={'bicarbonate': N},
                projected={'ph': ph_current, 'ta': ta_target},
                strategy='direct',
                explanation=f'{N:.1f} TBSP bicarbonate'
            )
        elif delta_ta < 0:
            # Need to lower TA - only bisulfate can do it, but it lowers pH too
            # This is a sequential situation
            return ChemSolution(
                feasible=True,
                chemicals={},
                projected={'ph': ph_current, 'ta': ta_current},
                strategy='sequential',
                explanation='TA high but pH on target. Use bisulfate sparingly, retest.'
            )
        else:
            return ChemSolution(
                feasible=True,
                chemicals={},
                projected={'ph': ph_current, 'ta': ta_current},
                strategy='direct',
                explanation='No adjustment needed'
            )


def is_out_of_spec(param: str, value: float) -> bool:
    """CHEM-010: Check if value is outside acceptable range."""
    if param not in TARGET_RANGES:
        return False
    min_val, max_val = TARGET_RANGES[param]
    return value < min_val or value > max_val


def estimate_aeration_time(ph_current: float, ph_target: float, ta: float, 
                           k_calibrated: float = 0.10) -> float:
    """
    AERATE-007: Estimate aeration duration in hours.
    
    t_hours = (target_pH - current_pH) / (k × 100 / TA)
    """
    if ph_current >= ph_target:
        return 0
    buffer_factor = 100 / ta
    return (ph_target - ph_current) / (k_calibrated * buffer_factor)


def calculate_k_observed(ph_before: float, ph_after: float, 
                         duration_hours: float, ta: float) -> float:
    """
    AERATE-005: Calculate observed aeration coefficient.
    
    k = ΔpH / (t_hours × buffer_factor)
    """
    if duration_hours <= 0:
        return 0
    delta_ph = ph_after - ph_before
    buffer_factor = 100 / ta
    return delta_ph / (duration_hours * buffer_factor)


# =============================================================================
# TEST CLASSES
# =============================================================================

class TestCHEM(unittest.TestCase):
    """Chemistry Solver (CHEM-001 through CHEM-015)."""
    
    def test_CHEM_001_effect_matrix_complete(self):
        """CHEM-001: Effect matrix defines all chemicals and parameters."""
        required_chemicals = ['bisulfate', 'carbonate', 'bicarbonate', 'dichlor', 'salt']
        required_params = ['ph', 'ta', 'fac', 'cya', 'salt']
        
        for chem in required_chemicals:
            self.assertIn(chem, EFFECT_MATRIX)
            for param in required_params:
                self.assertIn(param, EFFECT_MATRIX[chem])
    
    def test_CHEM_001_effect_values(self):
        """CHEM-001: Effect values match specification."""
        self.assertEqual(EFFECT_MATRIX['bisulfate']['ph'], -0.15)
        self.assertEqual(EFFECT_MATRIX['bisulfate']['ta'], -5)
        self.assertEqual(EFFECT_MATRIX['carbonate']['ph'], 0.10)
        self.assertEqual(EFFECT_MATRIX['carbonate']['ta'], 8)
        self.assertEqual(EFFECT_MATRIX['bicarbonate']['ta'], 7)
        self.assertEqual(EFFECT_MATRIX['dichlor']['fac'], 1.2)
        self.assertEqual(EFFECT_MATRIX['dichlor']['cya'], 0.9)
        self.assertEqual(EFFECT_MATRIX['salt']['salt'], 228)
    
    def test_CHEM_002_operational_targets(self):
        """CHEM-002: Operational targets account for drift."""
        self.assertEqual(OPERATIONAL_TARGETS['ph'], 7.2)  # Low end for drift
        self.assertEqual(OPERATIONAL_TARGETS['ta'], 80)   # Per manufacturer
        self.assertEqual(OPERATIONAL_TARGETS['fac'], 3)
        self.assertEqual(OPERATIONAL_TARGETS['salt'], 1750)
    
    def test_CHEM_003_coupled_parameters(self):
        """CHEM-003: pH and TA are coupled via bisulfate/carbonate."""
        # Bisulfate affects both pH and TA
        self.assertNotEqual(EFFECT_MATRIX['bisulfate']['ph'], 0)
        self.assertNotEqual(EFFECT_MATRIX['bisulfate']['ta'], 0)
        # Carbonate affects both pH and TA
        self.assertNotEqual(EFFECT_MATRIX['carbonate']['ph'], 0)
        self.assertNotEqual(EFFECT_MATRIX['carbonate']['ta'], 0)
    
    def test_CHEM_005_non_negativity(self):
        """CHEM-005: Solutions have non-negative chemical amounts."""
        # pH high, TA low - should produce valid solution
        result = solve_ph_ta(8.0, 50)
        for chem, amount in result.chemicals.items():
            with self.subTest(chemical=chem):
                self.assertGreaterEqual(amount, 0)
    
    def test_CHEM_006_joint_solve_ph_high_ta_low(self):
        """CHEM-006: Joint solve for pH=8.0, TA=50 (CHEM-TC-001)."""
        result = solve_ph_ta(8.0, 50)
        
        self.assertTrue(result.feasible)
        self.assertIn('bisulfate', result.chemicals)
        self.assertIn('bicarbonate', result.chemicals)
        
        # Check amounts are reasonable
        # pH 8.0 -> 7.2 needs ~5.3 TBSP bisulfate
        self.assertAlmostEqual(result.chemicals['bisulfate'], 5.33, delta=0.5)
        
        # Verify projected values hit targets
        self.assertAlmostEqual(result.projected['ph'], 7.2, delta=0.1)
        self.assertAlmostEqual(result.projected['ta'], 80, delta=5)
    
    def test_CHEM_007_infeasibility_detection(self):
        """CHEM-007/008/009: Detect infeasible case requiring aeration (CHEM-TC-003)."""
        # pH low, TA high - no chemical solution
        result = solve_ph_ta(7.0, 140)
        
        self.assertEqual(result.strategy, 'aeration')
        self.assertIn('aeration', result.explanation.lower())
    
    def test_CHEM_010_out_of_spec_detection(self):
        """CHEM-010: Correctly identify out-of-spec values."""
        # pH
        self.assertFalse(is_out_of_spec('ph', 7.4))  # in range
        self.assertTrue(is_out_of_spec('ph', 8.0))   # above max
        self.assertTrue(is_out_of_spec('ph', 7.0))   # below min
        
        # TA
        self.assertFalse(is_out_of_spec('ta', 80))   # in range
        self.assertTrue(is_out_of_spec('ta', 140))   # above max
        self.assertTrue(is_out_of_spec('ta', 30))    # below min
    
    def test_CHEM_013_overcorrection_prevention(self):
        """CHEM-013: Solver prevents TA from dropping below min (CHEM-TC-007)."""
        # pH high, TA borderline low
        result = solve_ph_ta(7.9, 45)
        
        # Should not recommend full bisulfate that would tank TA
        # 0.7 pH drop / 0.15 = 4.67 TBSP bisulfate = -23 ppm TA
        # 45 - 23 = 22 ppm < 40 min!
        self.assertGreaterEqual(result.projected['ta'], TARGET_RANGES['ta'][0])
    
    def test_CHEM_014_fac_independence(self):
        """CHEM-014: FAC/CYA are independent from pH/TA effects."""
        # Verify dichlor doesn't affect pH/TA
        self.assertEqual(EFFECT_MATRIX['dichlor']['ph'], 0)
        self.assertEqual(EFFECT_MATRIX['dichlor']['ta'], 0)
        
        # Verify pH/TA chemicals don't affect FAC
        self.assertEqual(EFFECT_MATRIX['bisulfate']['fac'], 0)
        self.assertEqual(EFFECT_MATRIX['carbonate']['fac'], 0)
        self.assertEqual(EFFECT_MATRIX['bicarbonate']['fac'], 0)


class TestAERATE(unittest.TestCase):
    """Aeration Tracking and Calibration (AERATE-001 through AERATE-008)."""
    
    def test_AERATE_005_k_calculation(self):
        """AERATE-005: Correct k_observed calculation (AERATE-TC-002)."""
        # pH 7.0 -> 7.2 over 2 hours, TA=100
        k = calculate_k_observed(
            ph_before=7.0,
            ph_after=7.2,
            duration_hours=2.0,
            ta=100
        )
        # k = 0.2 / (2 × 100/100) = 0.2 / 2 = 0.10
        self.assertAlmostEqual(k, 0.10, delta=0.01)
    
    def test_AERATE_005_k_with_high_ta(self):
        """AERATE-005: k calculation accounts for TA buffer effect."""
        # Same pH change, same time, but TA=200 (stronger buffer)
        k = calculate_k_observed(
            ph_before=7.0,
            ph_after=7.2,
            duration_hours=2.0,
            ta=200
        )
        # k = 0.2 / (2 × 100/200) = 0.2 / 1 = 0.20
        # Higher k means faster at same TA (this is the intrinsic rate)
        self.assertAlmostEqual(k, 0.20, delta=0.01)
    
    def test_AERATE_006_default_k(self):
        """AERATE-006: Default k is 0.10 when no calibration data."""
        # Estimate with default
        t = estimate_aeration_time(7.0, 7.2, ta=100, k_calibrated=0.10)
        # t = 0.2 / (0.10 × 1) = 2.0 hours
        self.assertAlmostEqual(t, 2.0, delta=0.1)
    
    def test_AERATE_007_time_estimate(self):
        """AERATE-007: Correct time estimate (AERATE-TC-003)."""
        # pH 7.0 -> 7.2, TA=120, k=0.10
        t = estimate_aeration_time(7.0, 7.2, ta=120, k_calibrated=0.10)
        # t = 0.2 / (0.10 × 100/120) = 0.2 / 0.0833 = 2.4 hours
        self.assertAlmostEqual(t, 2.4, delta=0.1)
    
    def test_AERATE_007_time_with_calibrated_k(self):
        """AERATE-007: Time estimate uses calibrated k."""
        # With faster observed rate (k=0.15)
        t_fast = estimate_aeration_time(7.0, 7.2, ta=100, k_calibrated=0.15)
        # t = 0.2 / (0.15 × 1) = 1.33 hours
        self.assertAlmostEqual(t_fast, 1.33, delta=0.1)
        
        # With slower observed rate (k=0.05)
        t_slow = estimate_aeration_time(7.0, 7.2, ta=100, k_calibrated=0.05)
        # t = 0.2 / (0.05 × 1) = 4.0 hours
        self.assertAlmostEqual(t_slow, 4.0, delta=0.1)
    
    def test_AERATE_007_no_time_when_ph_ok(self):
        """AERATE-007: Zero time when pH already at/above target."""
        t = estimate_aeration_time(7.3, 7.2, ta=100, k_calibrated=0.10)
        self.assertEqual(t, 0)


class TestCHEMDashboard(unittest.TestCase):
    """Dashboard implementation of CHEM requirements."""
    
    def setUp(self):
        from pathlib import Path
        candidates = [
            Path('/mnt/skills/user/hot-tub-maintenance/assets/dashboard.jsx'),
            Path(__file__).parent.parent / 'assets' / 'dashboard.jsx',
            Path('/home/claude/hot-tub-maintenance/assets/dashboard.jsx'),
        ]
        self.dash = ''
        for p in candidates:
            if p.exists():
                self.dash = p.read_text()
                break
    
    def test_CHEM_001_effect_matrix_in_dashboard(self):
        """CHEM-001: Dashboard defines TREATMENT_EFFECTS with multi-param effects."""
        # Check bisulfate has both effects
        self.assertIn('bisulfate', self.dash)
        self.assertIn('ph:', self.dash.lower()) or self.assertIn("'ph'", self.dash)
    
    def test_UI_021_aeration_placeholder(self):
        """UI-021: Dashboard will need aeration controls (placeholder test)."""
        # This test will fail until implementation
        # Checking for future aeration UI elements
        # self.assertIn('aeration', self.dash.lower())
        pass  # Placeholder until implementation


class TestAERATEDashboard(unittest.TestCase):
    """Dashboard implementation of AERATE requirements (placeholder)."""
    
    def setUp(self):
        from pathlib import Path
        candidates = [
            Path('/mnt/skills/user/hot-tub-maintenance/assets/dashboard.jsx'),
            Path(__file__).parent.parent / 'assets' / 'dashboard.jsx',
            Path('/home/claude/hot-tub-maintenance/assets/dashboard.jsx'),
        ]
        self.dash = ''
        for p in candidates:
            if p.exists():
                self.dash = p.read_text()
                break
    
    def test_AERATE_001_states_placeholder(self):
        """AERATE-001: Dashboard will track aeration states (placeholder)."""
        # Will need: aerating state, start/stop buttons
        pass
    
    def test_AERATE_002_start_flow_placeholder(self):
        """AERATE-002: Start aeration flow with optional pH (placeholder)."""
        pass
    
    def test_AERATE_003_timer_display_placeholder(self):
        """AERATE-003: Timer during aeration (placeholder)."""
        pass
    
    def test_AERATE_004_stop_flow_placeholder(self):
        """AERATE-004: Stop flow with calibration option (placeholder)."""
        pass
    
    def test_AERATE_008_event_types_placeholder(self):
        """AERATE-008: Event storage for aeration types (placeholder)."""
        pass


if __name__ == '__main__':
    unittest.main(verbosity=2)
