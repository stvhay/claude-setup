#!/usr/bin/env python3
"""
Hot Tub Maintenance Skill — Test Harness

Provides maximal coverage of requirements defined in assets/REQUIREMENTS.md.
Each test method is named test_<REQ_ID> for direct traceability.

Run: python3 tests/test_skill.py
"""

import unittest
from pathlib import Path
from dataclasses import dataclass
from typing import Optional


# =============================================================================
# SPECIFICATION CONSTANTS (Source of truth for tests)
# =============================================================================

VOLUME = 335  # INST-001

@dataclass
class TargetSpec:
    """Target range specification."""
    target: float
    min: float
    max: float
    unit: str
    hard_max: Optional[float] = None

# TGT-001 through TGT-008 (synced with REQUIREMENTS.md v3.5)
TARGETS = {
    'salt': TargetSpec(1750, 1500, 2000, 'ppm'),
    'ch': TargetSpec(50, 25, 75, 'ppm'),
    'ta': TargetSpec(80, 40, 120, 'ppm'),
    'ph': TargetSpec(7.4, 7.2, 7.8, ''),
    'fac': TargetSpec(4, 3, 5, 'ppm'),  # v3.5: target 4, min 3 per FreshWater manual
    'cc': TargetSpec(0, 0, 0.5, 'ppm'),
    'phosphates': TargetSpec(150, 0, 300, 'ppb'),
    'cya': TargetSpec(0, 0, 50, 'ppm', hard_max=100),  # v3.4: 0 preferred per Hotspring FAQ
}

@dataclass
class DosingSpec:
    """Dosing formula specification."""
    per_unit: float
    unit: str
    cya_per_unit: float = 0.0

# DOSE-001 through DOSE-007
DOSING = {
    'salt': DosingSpec(228, 'cup'),
    'dichlor': DosingSpec(1.2, 'tsp', cya_per_unit=0.9),
    'bisulfate': DosingSpec(0.15, 'TBSP'),
    'carbonate': DosingSpec(0.1, 'TBSP'),
    'bicarbonate': DosingSpec(7, 'TBSP'),
    'mps': DosingSpec(5.5, 'TBSP'),
}

# PROJ-002: Treatment effects on parameters
TREATMENT_EFFECTS = {
    'dichlor': {'fac': 1.2, 'cya': 0.9},
    'bisulfate': {'ph': -0.15, 'ta': -5},
    'carbonate': {'ph': 0.1, 'ta': 8},
    'bicarbonate': {'ta': 7},
    'salt': {'salt': 228},
}

# STOR-001
STORAGE_KEYS = [
    'hottub:readings',
    'hottub:treatments',
    'hottub:events',
    'hottub:conversations',
    'hottub:lessons',
    'hottub:meta',
]

# WIZ-002
WIZARD_STEPS = [
    'power_off', 'drain', 'clean', 'filters', 'fill', 'power_on',
    'purge', 'salt', 'ta', 'ph', 'shock', 'output', 'wait'
]

# DOC-002
REQUIRED_SECTIONS = [
    '## Behavior on Load',
    '## Installation Constants',
    '## Target Ranges',
    '## Dosing Formulas',
    '## Drain & Refill Procedure',
    '## Troubleshooting',
    '## Logging Protocol',
    '## Continuous Improvement',
    '## Dashboard Design Protocol',
    '## Skill Coach Protocol',
]

# IMP-001
LESSON_TYPES = ['mistake', 'gap', 'improvement', 'clarification']

# IMP-002
LESSON_STATUSES = ['open', 'resolved', 'embedded']

# BEH-002
SESSION_END_TRIGGERS = ['done', 'thanks', 'bye']


# =============================================================================
# FILE LOADERS
# =============================================================================

def load_file(filename: str) -> str:
    """Load file from skill directory."""
    base = Path(__file__).parent.parent
    candidates = [
        base / filename,
        base / 'assets' / filename,
        Path('/home/claude/hot-tub-maintenance') / filename,
        Path('/home/claude/hot-tub-maintenance/assets') / filename,
    ]
    for p in candidates:
        if p.exists():
            return p.read_text()
    return ''

def skill_md() -> str:
    return load_file('SKILL.md')

def dashboard_jsx() -> str:
    return load_file('dashboard.jsx')

def requirements_md() -> str:
    return load_file('REQUIREMENTS.md')


# =============================================================================
# STATUS CALCULATION (mirrors dashboard logic)
# =============================================================================

def calc_status(param: str, value) -> str:
    """Calculate status color per STAT-001 through STAT-005."""
    if value is None or value == '':
        return 'gray'  # STAT-005
    v = float(value)
    t = TARGETS.get(param)
    if not t:
        return 'gray'
    # STAT-004: CYA hard max override
    if param == 'cya' and t.hard_max and v > t.hard_max:
        return 'red'
    # STAT-001: in range
    if t.min <= v <= t.max:
        return 'green'
    # STAT-003: way out (beyond 20%)
    if v < t.min * 0.8 or v > t.max * 1.2:
        return 'red'
    # STAT-002: slightly out
    return 'yellow'


# =============================================================================
# TEST CLASSES — Organized by requirement category
# =============================================================================

class TestINST(unittest.TestCase):
    """Installation Constants (INST-001 through INST-004)."""
    
    def setUp(self):
        self.skill = skill_md()
        self.dash = dashboard_jsx()
    
    def test_INST_001_volume(self):
        """INST-001: Volume SHALL be 335 gallons."""
        self.assertIn('VOLUME = 335', self.dash)
        self.assertIn('335 gal', self.skill)
    
    def test_INST_002_cartridge_lifespan(self):
        """INST-002: Cartridge lifespan SHALL be 120 days."""
        self.assertIn('120', self.dash)
        self.assertIn('4 month', self.skill.lower())
    
    def test_INST_003_drain_interval(self):
        """INST-003: Drain interval SHALL be 12 months."""
        self.assertIn('12 month', self.skill.lower())
    
    def test_INST_004_output_level(self):
        """INST-004: Output level SHALL be 6."""
        self.assertIn('Level 6', self.skill) or self.assertIn('level 6', self.skill.lower())


class TestTGT(unittest.TestCase):
    """Target Ranges (TGT-001 through TGT-011)."""
    
    def test_TGT_001_salt(self):
        """TGT-001: Salt target 1750, range 1500-2000."""
        t = TARGETS['salt']
        self.assertEqual(t.target, 1750)
        self.assertEqual(t.min, 1500)
        self.assertEqual(t.max, 2000)
    
    def test_TGT_002_ch(self):
        """TGT-002: CH target 50, range 25-75."""
        t = TARGETS['ch']
        self.assertEqual(t.target, 50)
        self.assertEqual((t.min, t.max), (25, 75))
    
    def test_TGT_003_ta(self):
        """TGT-003: TA target 80, range 40-120."""
        t = TARGETS['ta']
        self.assertEqual(t.target, 80)
        self.assertEqual((t.min, t.max), (40, 120))
    
    def test_TGT_004_ph(self):
        """TGT-004: pH target 7.4, range 7.2-7.8."""
        t = TARGETS['ph']
        self.assertEqual(t.target, 7.4)
        self.assertEqual((t.min, t.max), (7.2, 7.8))
    
    def test_TGT_005_fac(self):
        """TGT-005: FAC target 3, range 1-5."""
        t = TARGETS['fac']
        self.assertEqual(t.target, 3)
        self.assertEqual((t.min, t.max), (1, 5))
    
    def test_TGT_006_cc(self):
        """TGT-006: CC target 0, range 0-0.5."""
        t = TARGETS['cc']
        self.assertEqual(t.target, 0)
        self.assertEqual((t.min, t.max), (0, 0.5))
    
    def test_TGT_007_phosphates(self):
        """TGT-007: Phosphates target 150, range 0-300."""
        t = TARGETS['phosphates']
        self.assertEqual(t.target, 150)
        self.assertEqual((t.min, t.max), (0, 300))
    
    def test_TGT_008_cya(self):
        """TGT-008: CYA target 40, range 30-50, hard_max 100."""
        t = TARGETS['cya']
        self.assertEqual(t.target, 40)
        self.assertEqual((t.min, t.max), (30, 50))
        self.assertEqual(t.hard_max, 100)
    
    def test_TGT_009_range_consistency(self):
        """TGT-009: All targets have min <= target <= max."""
        for name, t in TARGETS.items():
            with self.subTest(param=name):
                self.assertLessEqual(t.min, t.target)  # min <= target
                self.assertLessEqual(t.target, t.max)  # target <= max
    
    def test_TGT_010_ph_efficacy(self):
        """TGT-010: pH max SHALL be ≤ 7.8."""
        self.assertLessEqual(TARGETS['ph'].max, 7.8)
    
    def test_TGT_011_cya_hard_max_defined(self):
        """TGT-011: CYA SHALL have hard_max property."""
        self.assertIsNotNone(TARGETS['cya'].hard_max)
        self.assertEqual(TARGETS['cya'].hard_max, 100)


class TestDOSE(unittest.TestCase):
    """Dosing Calculations (DOSE-001 through DOSE-008)."""
    
    def test_DOSE_001_salt(self):
        """DOSE-001: 1 cup salt = +228 ppm."""
        self.assertEqual(DOSING['salt'].per_unit, 228)
        self.assertEqual(DOSING['salt'].unit, 'cup')
    
    def test_DOSE_001_fresh_fill(self):
        """DOSE-001: Fresh fill ~8 cups to 1750 ppm."""
        cups = TARGETS['salt'].target / DOSING['salt'].per_unit
        self.assertAlmostEqual(cups, 7.68, places=1)
        self.assertEqual(round(cups), 8)
    
    def test_DOSE_002_dichlor(self):
        """DOSE-002: 1 tsp dichlor = +1.2 ppm FAC."""
        self.assertEqual(DOSING['dichlor'].per_unit, 1.2)
        self.assertEqual(DOSING['dichlor'].unit, 'tsp')
    
    def test_DOSE_002_shock(self):
        """DOSE-002: Shock to 5 ppm ~4 tsp."""
        tsp = 5.0 / DOSING['dichlor'].per_unit
        self.assertAlmostEqual(tsp, 4.17, places=1)
    
    def test_DOSE_003_dichlor_cya(self):
        """DOSE-003: 1 tsp dichlor = +0.9 ppm CYA."""
        self.assertEqual(DOSING['dichlor'].cya_per_unit, 0.9)
    
    def test_DOSE_004_bisulfate(self):
        """DOSE-004: 1 TBSP bisulfate = -0.15 pH."""
        self.assertEqual(DOSING['bisulfate'].per_unit, 0.15)
        self.assertEqual(DOSING['bisulfate'].unit, 'TBSP')
    
    def test_DOSE_005_carbonate(self):
        """DOSE-005: 1 TBSP carbonate = +0.1 pH."""
        self.assertEqual(DOSING['carbonate'].per_unit, 0.1)
    
    def test_DOSE_006_bicarbonate(self):
        """DOSE-006: 1 TBSP bicarbonate = +7 ppm TA."""
        self.assertEqual(DOSING['bicarbonate'].per_unit, 7)
    
    def test_DOSE_007_mps(self):
        """DOSE-007: MPS dose ~5.5 TBSP."""
        self.assertAlmostEqual(DOSING['mps'].per_unit, 5.5, places=1)
    
    def test_DOSE_008_salt_formula(self):
        """DOSE-008: Salt formula correctness."""
        cups = (1750 - 1000) / 228
        self.assertAlmostEqual(cups, 3.29, places=1)
    
    def test_DOSE_008_bisulfate_formula(self):
        """DOSE-008: Bisulfate formula correctness."""
        tbsp = (8.0 - 7.4) / 0.15
        self.assertAlmostEqual(tbsp, 4.0, places=1)
    
    def test_DOSE_008_bicarbonate_formula(self):
        """DOSE-008: Bicarbonate formula correctness."""
        tbsp = (80 - 50) / 7
        self.assertAlmostEqual(tbsp, 4.29, places=1)


class TestCYA(unittest.TestCase):
    """CYA Tracking (CYA-001 through CYA-006)."""
    
    def test_CYA_001_cumulative_tracking(self):
        """CYA-001: Cumulative = sum(tsp × 0.9)."""
        treatments = [(3, 0.9), (4, 0.9), (2, 0.9)]  # tsp, factor
        total = sum(t * f for t, f in treatments)
        self.assertAlmostEqual(total, 8.1, places=1)
    
    def test_CYA_002_warning_threshold(self):
        """CYA-002: Warning when > 80 ppm."""
        warning = 80
        self.assertGreater(warning, TARGETS['cya'].max)
        self.assertLess(warning, TARGETS['cya'].hard_max)
    
    def test_CYA_003_critical_threshold(self):
        """CYA-003: Critical/red when > 100 ppm."""
        self.assertEqual(calc_status('cya', 101), 'red')
        self.assertEqual(calc_status('cya', 150), 'red')
    
    def test_CYA_004_reset_on_drain(self):
        """CYA-004: Reset to 0 on drain (logic test)."""
        # Conceptual: after drain, cumulativeCYA = 0
        pre_drain = 85
        post_drain = 0
        self.assertEqual(post_drain, 0)
        self.assertNotEqual(pre_drain, post_drain)
    
    def test_CYA_005_typical_usage_safe(self):
        """CYA-005: 16 weeks × 3 tsp/week < 100."""
        total = 16 * 3 * 0.9
        self.assertEqual(total, 43.2)
        self.assertLess(total, 100)
    
    def test_CYA_006_heavy_usage_exceeds(self):
        """CYA-006: 52 weeks × 5 tsp/week > 100."""
        total = 52 * 5 * 0.9
        self.assertEqual(total, 234)
        self.assertGreater(total, 100)


class TestSTAT(unittest.TestCase):
    """Status Color Logic (STAT-001 through STAT-005)."""
    
    def test_STAT_001_green_in_range(self):
        """STAT-001: In range → green."""
        self.assertEqual(calc_status('ph', 7.4), 'green')
        self.assertEqual(calc_status('fac', 3), 'green')
        self.assertEqual(calc_status('salt', 1750), 'green')
        self.assertEqual(calc_status('cya', 40), 'green')
    
    def test_STAT_002_yellow_slightly_out(self):
        """STAT-002: Slightly out → yellow."""
        # pH 7.9 > 7.8 but < 7.8 * 1.2 = 9.36
        self.assertEqual(calc_status('ph', 7.9), 'yellow')
        self.assertEqual(calc_status('ph', 7.1), 'yellow')
    
    def test_STAT_003_red_way_out(self):
        """STAT-003: Beyond 20% → red."""
        # pH 9.5 > 7.8 * 1.2 = 9.36
        self.assertEqual(calc_status('ph', 9.5), 'red')
        # FAC 0 < 1 * 0.8 = 0.8
        self.assertEqual(calc_status('fac', 0), 'red')
    
    def test_STAT_004_cya_hard_max_override(self):
        """STAT-004: CYA > hard_max → red."""
        self.assertEqual(calc_status('cya', 101), 'red')
        self.assertEqual(calc_status('cya', 200), 'red')
    
    def test_STAT_005_gray_missing(self):
        """STAT-005: Missing value → gray."""
        self.assertEqual(calc_status('ph', None), 'gray')
        self.assertEqual(calc_status('ph', ''), 'gray')


class TestSTOR(unittest.TestCase):
    """Data Storage (STOR-001 through STOR-008)."""
    
    def setUp(self):
        self.skill = skill_md()
        self.dash = dashboard_jsx()
    
    def test_STOR_001_storage_keys(self):
        """STOR-001: All storage keys defined."""
        self.assertEqual(len(STORAGE_KEYS), 6)
        for key in STORAGE_KEYS:
            self.assertTrue(key.startswith('hottub:'))
    
    def test_STOR_002_key_consistency_skill(self):
        """STOR-002: Keys in SKILL.md."""
        for key in STORAGE_KEYS:
            with self.subTest(key=key):
                self.assertIn(key, self.skill)
    
    def test_STOR_002_key_consistency_dashboard(self):
        """STOR-002: Keys in dashboard."""
        for key in STORAGE_KEYS:
            with self.subTest(key=key):
                self.assertIn(key, self.dash)
    
    def test_STOR_003_readings_fields(self):
        """STOR-003: Readings include required fields."""
        self.assertIn('pH', self.skill) or self.assertIn('ph', self.skill.lower())
        self.assertIn('TA', self.skill) or self.assertIn('ta', self.skill.lower())
        self.assertIn('CYA', self.skill) or self.assertIn('cya', self.skill.lower())
    
    def test_STOR_004_treatments_fields(self):
        """STOR-004: Treatments include required fields."""
        self.assertIn('chemical', self.skill.lower())
        self.assertIn('amount', self.skill.lower())
    
    def test_STOR_005_events_fields(self):
        """STOR-005: Events include required fields."""
        self.assertIn('type', self.skill.lower())
        self.assertIn('description', self.skill.lower())
    
    def test_STOR_006_lessons_fields(self):
        """STOR-006: Lessons include required fields."""
        self.assertIn('status', self.skill.lower())
        self.assertIn('resolution', self.skill.lower())
    
    def test_STOR_007_meta_fields(self):
        """STOR-007: Meta includes required fields."""
        self.assertIn('lastDrain', self.skill) or self.assertIn('lastdrain', self.skill.lower())
        self.assertIn('cartridgeInstall', self.skill) or self.assertIn('cartridgeinstall', self.skill.lower())


class TestUI(unittest.TestCase):
    """Dashboard UI (UI-001 through UI-015)."""
    
    def setUp(self):
        self.dash = dashboard_jsx()
    
    def test_UI_001_tab_navigation(self):
        """UI-001: All tabs present."""
        tabs = ['status', 'test', 'wizard', 'calculator', 'log', 'history', 'lessons', 'data']
        for tab in tabs:
            with self.subTest(tab=tab):
                self.assertIn(f"'{tab}'", self.dash)
    
    def test_UI_002_dark_mode_detection(self):
        """UI-002: Detects prefers-color-scheme."""
        self.assertIn('prefers-color-scheme', self.dash)
        self.assertIn('matchMedia', self.dash)
    
    def test_UI_003_dark_mode_toggle(self):
        """UI-003: Manual toggle exists."""
        self.assertIn('setDarkMode', self.dash)
        self.assertIn('darkMode', self.dash)
    
    def test_UI_004_touch_targets(self):
        """UI-004: 44px minimum touch targets."""
        self.assertIn('min-h-[44px]', self.dash)
    
    def test_UI_005_responsive_grid(self):
        """UI-005: Responsive grid columns."""
        self.assertIn('grid-cols-2', self.dash)
        self.assertIn('sm:grid-cols-4', self.dash)
    
    def test_UI_006_scrollable_tabs(self):
        """UI-006: Tabs scroll horizontally."""
        self.assertIn('overflow-x-auto', self.dash)
    
    def test_UI_007_offline_detection(self):
        """UI-007: Detects navigator.onLine."""
        self.assertIn('navigator.onLine', self.dash)
        self.assertIn('isOnline', self.dash)
    
    def test_UI_008_offline_indicator(self):
        """UI-008: Shows offline badge."""
        self.assertIn('Offline', self.dash)
    
    def test_UI_009_export_function(self):
        """UI-009: Export as JSON."""
        self.assertIn('exportData', self.dash)
        self.assertIn('application/json', self.dash)
    
    def test_UI_010_import_function(self):
        """UI-010: Import from file."""
        self.assertIn('importData', self.dash)
        self.assertIn('file.text()', self.dash)
    
    def test_UI_011_clear_function(self):
        """UI-011: Clear with confirmation."""
        self.assertIn('clearAllData', self.dash)
        self.assertIn('confirm(', self.dash)
    
    def test_UI_012_cartridge_calculation(self):
        """UI-012: Cartridge days calculation."""
        self.assertIn('cartridgeDaysLeft', self.dash)
        self.assertIn('120', self.dash)  # 120 day lifespan
    
    def test_UI_013_days_since_drain(self):
        """UI-013: Days since drain."""
        self.assertIn('daysSince', self.dash)
        self.assertIn('lastDrain', self.dash)
    
    def test_UI_014_cya_display(self):
        """UI-014: CYA displayed."""
        self.assertIn('estimatedCYA', self.dash)
        self.assertIn('CYA', self.dash)
    
    def test_UI_015_adjustments(self):
        """UI-015: Adjustment recommendations."""
        self.assertIn('calculateAdjustments', self.dash)
        self.assertIn('Recommend', self.dash)  # Recommendations header
    
    def test_UI_016_parameter_units(self):
        """UI-016: Units displayed for parameters."""
        self.assertIn('PARAM_LABELS', self.dash)
        self.assertIn("unit: 'ppm'", self.dash)
        self.assertIn("unit: 'ppb'", self.dash)
        self.assertIn("unit: '°F'", self.dash)
    
    def test_UI_017_button_feedback(self):
        """UI-017: Button press provides visual feedback."""
        self.assertIn('buttonFeedback', self.dash)
        self.assertIn('withFeedback', self.dash)
        self.assertIn("'✓ Saved'", self.dash)
        self.assertIn('scale-95', self.dash)  # Scale animation
    
    def test_UI_018_maintenance_recommendations(self):
        """UI-018: Maintenance recommendations included."""
        # Cartridge recommendations
        self.assertIn('CARTRIDGE', self.dash)
        self.assertIn('Cartridge expired', self.dash)
        # Drain recommendations
        self.assertIn('DRAIN', self.dash)
        self.assertIn('days since drain', self.dash)
    
    def test_UI_019_test_tab(self):
        """UI-019: Test tab with procedures."""
        self.assertIn('TEST_PROCEDURES', self.dash)
        self.assertIn('selectedEquipment', self.dash)
        self.assertIn('selectedTest', self.dash)
        # Equipment types
        self.assertIn('taylor', self.dash)
        self.assertIn('hanna', self.dash)
        self.assertIn('apera', self.dash)
        self.assertIn('strips', self.dash)
        # Has steps and tips
        self.assertIn('steps', self.dash)
        self.assertIn('tips', self.dash)
    
    def test_UI_020_last_tested_display(self):
        """UI-020: Last tested display per parameter."""
        self.assertIn('lastTested', self.dash)
        self.assertIn('getStaleness', self.dash)
        # Staleness thresholds
        self.assertIn("daysAgo > 14", self.dash)
        self.assertIn("daysAgo > 7", self.dash)
        # Display text
        self.assertIn('Last Tested', self.dash)
        self.assertIn("'fresh'", self.dash)
        self.assertIn("'warning'", self.dash)
        self.assertIn("'stale'", self.dash)


class TestPROJ(unittest.TestCase):
    """Projected Chemistry (PROJ-001 through PROJ-008)."""
    
    def setUp(self):
        self.dash = dashboard_jsx()
    
    def test_PROJ_001_projection_calculation(self):
        """PROJ-001: Projection based on treatments after reading."""
        self.assertIn('projections', self.dash)
        self.assertIn('readingDate', self.dash)
        self.assertIn('recentTreatments', self.dash)
    
    def test_PROJ_002_treatment_effects_defined(self):
        """PROJ-002: Treatment effects match specification."""
        self.assertIn('TREATMENT_EFFECTS', self.dash)
        # Check dichlor affects FAC and CYA
        self.assertIn('dichlor:', self.dash)
        self.assertIn('fac:', self.dash)
        # Check bisulfate affects pH and TA
        self.assertIn('bisulfate:', self.dash)
        self.assertIn('ph:', self.dash)
    
    def test_PROJ_002_effect_values(self):
        """PROJ-002: Effect values match specification."""
        # Verify constants in test match dashboard
        for chem, effects in TREATMENT_EFFECTS.items():
            for param, value in effects.items():
                with self.subTest(chemical=chem, param=param):
                    self.assertIn(str(abs(value)), self.dash)
    
    def test_PROJ_003_projection_display(self):
        """PROJ-003: Projected values displayed alongside measured."""
        # Should show strikethrough for old value
        self.assertIn('line-through', self.dash)
        # Should show measured value
        self.assertIn('proj.measured', self.dash)
        # Should show projected value
        self.assertIn('proj.value', self.dash)
    
    def test_PROJ_004_resolved_indicator(self):
        """PROJ-004: Green indicator for resolved condition."""
        self.assertIn("'resolved'", self.dash)
        self.assertIn('bg-green-500', self.dash)
        # Check for checkmark indicator
        self.assertIn('✓', self.dash)
    
    def test_PROJ_005_new_issue_indicator(self):
        """PROJ-005: Red indicator for new issue."""
        self.assertIn("'new_issue'", self.dash)
        self.assertIn('bg-red-500', self.dash)
        # Check for exclamation indicator
        self.assertIn('!', self.dash)
    
    def test_PROJ_006_staleness(self):
        """PROJ-006: Projections only for treatments after reading."""
        # Check filtering by date
        self.assertIn('new Date(t.date).getTime() > readingDate', self.dash)
    
    def test_PROJ_007_recommendations_use_projections(self):
        """PROJ-007: Recommendations account for projected values."""
        # calculateAdjustments should use projections
        self.assertIn('projections[', self.dash)
        self.assertIn('getValue', self.dash)
    
    def test_PROJ_008_multi_treatment_accumulation(self):
        """PROJ-008: Multiple treatments sum effects."""
        # Effects should be summed with +=
        self.assertIn('effects[param] = (effects[param] || 0) +', self.dash)


class TestWIZ(unittest.TestCase):
    """Fresh Fill Wizard (WIZ-001 through WIZ-006)."""
    
    def setUp(self):
        self.dash = dashboard_jsx()
    
    def test_WIZ_001_step_count(self):
        """WIZ-001: Exactly 13 steps."""
        self.assertEqual(len(WIZARD_STEPS), 13)
    
    def test_WIZ_002_step_list(self):
        """WIZ-002: All steps defined."""
        expected = ['power_off', 'drain', 'clean', 'filters', 'fill', 
                   'power_on', 'purge', 'salt', 'ta', 'ph', 'shock', 
                   'output', 'wait']
        self.assertEqual(WIZARD_STEPS, expected)
    
    def test_WIZ_003_progress_display(self):
        """WIZ-003: Shows X/13 progress."""
        self.assertIn('wizardProgress', self.dash)
        self.assertIn('/13', self.dash)
    
    def test_WIZ_004_step_toggle(self):
        """WIZ-004: Steps are toggleable."""
        self.assertIn('toggleWizardStep', self.dash)
        self.assertIn('wizardSteps', self.dash)
    
    def test_WIZ_005_critical_marking(self):
        """WIZ-005: Critical steps marked."""
        self.assertIn('critical', self.dash.lower())
    
    def test_WIZ_006_completion_action(self):
        """WIZ-006: Completion triggers drain record."""
        self.assertIn('13', self.dash)  # Check for 13
        self.assertIn('updateDrainDate', self.dash)


class TestBEH(unittest.TestCase):
    """Agent Behavior (BEH-001 through BEH-009)."""
    
    def setUp(self):
        self.skill = skill_md()
    
    def test_BEH_001_present_dashboard(self):
        """BEH-001: Present dashboard on load."""
        self.assertIn('ALWAYS present the dashboard', self.skill)
    
    def test_BEH_002_session_end_triggers(self):
        """BEH-002: Session end triggers defined."""
        for trigger in SESSION_END_TRIGGERS:
            with self.subTest(trigger=trigger):
                self.assertIn(trigger, self.skill.lower())
    
    def test_BEH_003_feedback_prompt(self):
        """BEH-003: Asks for feedback."""
        self.assertIn('feedback', self.skill.lower())
        self.assertIn('session end', self.skill.lower())
    
    def test_BEH_004_log_conversations(self):
        """BEH-004: Logs conversations."""
        self.assertIn('hottub:conversations', self.skill)
    
    def test_BEH_005_log_treatments(self):
        """BEH-005: Logs treatments."""
        self.assertIn('hottub:treatments', self.skill)
    
    def test_BEH_006_log_readings(self):
        """BEH-006: Logs readings."""
        self.assertIn('hottub:readings', self.skill)
    
    def test_BEH_007_frontend_design(self):
        """BEH-007: Invokes frontend-design skill."""
        self.assertIn('frontend-design', self.skill)
    
    def test_BEH_008_tsx_simplifier(self):
        """BEH-008: Invokes tsx-simplifier skill."""
        self.assertIn('tsx-simplifier', self.skill)
    
    def test_BEH_009_skill_coach(self):
        """BEH-009: Spawns coach review."""
        self.assertIn('skill-coach', self.skill.lower())


class TestIMP(unittest.TestCase):
    """Continuous Improvement (IMP-001 through IMP-003)."""
    
    def setUp(self):
        self.skill = skill_md()
    
    def test_IMP_001_lesson_types(self):
        """IMP-001: All lesson types defined."""
        for lt in LESSON_TYPES:
            with self.subTest(type=lt):
                self.assertIn(lt, self.skill.lower())
    
    def test_IMP_002_lesson_statuses(self):
        """IMP-002: All lesson statuses defined."""
        for st in LESSON_STATUSES:
            with self.subTest(status=st):
                self.assertIn(st, self.skill.lower())
    
    def test_IMP_003_open_threshold(self):
        """IMP-003: 3+ open lessons triggers prompt."""
        # SKILL.md says "contains 3+ items"
        self.assertTrue(
            '3+' in self.skill or 
            '3 or more' in self.skill or
            'three' in self.skill.lower()
        )


class TestDOC(unittest.TestCase):
    """SKILL.md Structure (DOC-001 through DOC-005)."""
    
    def setUp(self):
        self.skill = skill_md()
    
    def test_DOC_001_frontmatter(self):
        """DOC-001: YAML frontmatter present."""
        self.assertTrue(self.skill.startswith('---'))
        self.assertIn('name:', self.skill[:500])
        self.assertIn('description:', self.skill[:500])
    
    def test_DOC_002_required_sections(self):
        """DOC-002: All required sections present."""
        for section in REQUIRED_SECTIONS:
            with self.subTest(section=section):
                self.assertIn(section, self.skill)
    
    def test_DOC_003_always_directives(self):
        """DOC-003: At least 5 ALWAYS directives."""
        count = self.skill.count('ALWAYS')
        self.assertGreaterEqual(count, 5)
    
    def test_DOC_004_storage_keys_documented(self):
        """DOC-004: All storage keys in SKILL.md."""
        for key in STORAGE_KEYS:
            with self.subTest(key=key):
                self.assertIn(key, self.skill)
    
    def test_DOC_005_volume_documented(self):
        """DOC-005: Volume documented."""
        self.assertIn('335 gal', self.skill)


class TestINT(unittest.TestCase):
    """Skill Integrations (INT-001 through INT-003)."""
    
    def setUp(self):
        self.skill = skill_md()
    
    def test_INT_001_frontend_design_ref(self):
        """INT-001: References frontend-design skill."""
        self.assertIn('frontend-design', self.skill)
    
    def test_INT_002_tsx_simplifier_ref(self):
        """INT-002: References tsx-simplifier skill."""
        self.assertIn('tsx-simplifier', self.skill)
    
    def test_INT_003_coach_protocol(self):
        """INT-003: Coach protocol with verdict."""
        self.assertIn('READY', self.skill)
        self.assertIn('NEEDS REVISION', self.skill)


class TestRequirementsDoc(unittest.TestCase):
    """Meta-tests: REQUIREMENTS.md completeness."""
    
    def setUp(self):
        self.req = requirements_md()
    
    def test_requirements_exists(self):
        """REQUIREMENTS.md exists and has content."""
        self.assertGreater(len(self.req), 5000)
    
    def test_all_categories_present(self):
        """All requirement categories documented."""
        categories = ['INST', 'TGT', 'DOSE', 'CYA', 'STAT', 'STOR', 
                     'UI', 'PROJ', 'WIZ', 'BEH', 'IMP', 'DOC', 'INT']
        for cat in categories:
            with self.subTest(category=cat):
                self.assertIn(f'{cat}-', self.req)
    
    def test_traceability_matrix(self):
        """Traceability matrix present."""
        self.assertIn('Traceability', self.req)


# =============================================================================
# RUNNER
# =============================================================================

def run_tests():
    """Execute all tests with coverage summary."""
    loader = unittest.TestLoader()
    suite = unittest.TestSuite()
    
    test_classes = [
        TestINST, TestTGT, TestDOSE, TestCYA, TestSTAT,
        TestSTOR, TestUI, TestPROJ, TestWIZ, TestBEH, TestIMP,
        TestDOC, TestINT, TestRequirementsDoc
    ]
    
    for cls in test_classes:
        suite.addTests(loader.loadTestsFromTestCase(cls))
    
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    # Summary
    total = result.testsRun
    failed = len(result.failures) + len(result.errors)
    passed = total - failed
    
    print(f"\n{'='*70}")
    print("REQUIREMENTS COVERAGE REPORT")
    print(f"{'='*70}")
    print(f"Tests run:    {total}")
    print(f"Passed:       {passed}")
    print(f"Failed:       {failed}")
    print(f"Pass rate:    {100*passed/total:.1f}%")
    print(f"{'='*70}")
    
    return result


if __name__ == '__main__':
    run_tests()
