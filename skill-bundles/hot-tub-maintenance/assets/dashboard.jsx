import { useState, useEffect, useMemo, useRef, useCallback } from 'react';

/**
 * Hot Tub Maintenance Dashboard v3.10
 * 
 * Batch 1 fixes from user testing:
 * - #2: Treatment logging shows "awaiting verification" state
 * - #5: Mobile responsiveness (2-col base grid)
 * - #1/12: Maintenance actions promoted to dashboard
 * - #9: Aeration workflow with start pH input
 * - #13/14: Unified chronological history with type indicators
 * - #10: Theme-consistent header
 * - #16: Units shown in history and entry
 * - #17: Date format YYYY/MM/DD HH:MM AM/PM
 * - #20: Layout fix for collapsible sections
 * - #21: Button colors adjusted for light theme
 * - #3: Clarified projection display (combined result)
 * - #6/7/8: Added context for CC/CYA out-of-spec states
 * 
 * Batch 2 (v3.2):
 * - #19: Interaction states (hover, active, focus) per design-principles
 * - 150ms transitions with cubic-bezier(0.25, 1, 0.5, 1) easing
 * - Active scale feedback on buttons
 * - Focus-visible rings for keyboard navigation
 * - Modal backdrop fade animation
 * 
 * Batch 3 (v3.3):
 * - ReadingCards show projected values after logging treatments
 * - CYA card uses estimatedCYA when no tested value exists
 * - Aeration panel shows last aeration event for feedback
 * - Projected values indicated with ring and strikethrough styling
 * 
 * Batch 4 (v3.4):
 * - CYA target corrected per Hotspring spec: 0 preferred, 0-50 acceptable
 * - Removed erroneous "CYA low" warning (0 is ideal for covered salt system)
 * 
 * Batch 5 (v3.5):
 * - FAC target corrected per Hotspring spec: target 4, min 3, max 5 ppm
 * - Temperature kept as informational only (no min/max enforcement)
 * 
 * Batch 6 (v3.6):
 * - Temperature status logic: only flag >104°F (safety limit), any lower temp is green
 * - Chemistry model verified against first principles; bulk density noted as assumption
 * 
 * Batch 7 (v3.7):
 * - TAC projection: dichlor additions now project TAC increase (TAC = FAC + CC, so TAC rises with FAC)
 * - Recommendations use projected values: suppress recommendations when projected values are in-spec
 * - Fixes "Log button persists after treatment logged" by auto-suppressing addressed recommendations
 * 
 * Batch 8 (v3.8):
 * - Modal backdrop clicks now cancel (not save) - prevents accidental treatment logging
 * - Dichlor SHOCK now correctly projects FAC/TAC (fixed chemicalId lookup)
 * - Clear All Data enhanced with explicit error handling and feedback
 * - Log New button styling consistent (chevron indicators for toggle state)
 * - Export split into Download + Copy to Clipboard with explicit status feedback
 * 
 * Batch 9 (v3.9):
 * - CRITICAL: Fixed step 2 of multi-step recommendations disappearing after logging step 1
 *   - Root cause: solver only triggered when TA >10 below target; needed to be >5 to match solver's own threshold
 *   - Now triggers when TA < 75 (target 80 minus 5), ensuring bicarbonate step still appears after bisulfate
 * - Shock recommendation suppresses after shock logged (tracks _shockLogged flag)
 * - Multi-step recommendations now show "Step X of Y" and warning that projection assumes all steps
 * - Added Paste from Clipboard import option (symmetric with Copy export)
 * - Fixed Clear All Data: window.confirm() blocked in sandbox; replaced with custom modal
 *
 * Batch 10 (v3.10):
 * - CRITICAL: Synced test file TARGETS to match requirements (FAC 4/3-5, CYA 0/0-50)
 * - Accessibility: Added useFocusTrap hook for all modals
 * - Accessibility: Added ARIA labels to interactive elements
 * - DRY: Extracted applyTreatmentEffects utility for projections
 * - UX: History pagination with "Load more" button
 * - Unified version numbering across skill files
 */

// ============================================================================
// CONSTANTS
// ============================================================================

const VOLUME = 335;
const MS_PER_DAY = 86400000;
const STALE_THRESHOLD_DAYS = 7;

const TARGETS = {
  ph: { target: 7.4, min: 7.2, max: 7.8, unit: '', label: 'pH' },
  ta: { target: 80, min: 40, max: 120, unit: 'ppm', label: 'TA' },
  fac: { target: 4, min: 3, max: 5, unit: 'ppm', label: 'FAC' },
  tac: { target: 4, min: 3, max: 5, unit: 'ppm', label: 'TAC' },
  cc: { target: 0, min: 0, max: 0.5, unit: 'ppm', label: 'CC', derived: true },
  ch: { target: 50, min: 25, max: 75, unit: 'ppm', label: 'CH' },
  salt: { target: 1750, min: 1500, max: 2000, unit: 'ppm', label: 'Salt' },
  cya: { target: 0, min: 0, max: 50, unit: 'ppm', label: 'CYA', hardMax: 100 },
  carbonate: { target: null, min: 0, max: 500, unit: 'ppm', label: 'Carb' },
  phosphates: { target: 150, min: 0, max: 300, unit: 'ppb', label: 'Phos' },
  temp: { target: 100, min: 80, max: 104, unit: '°F', label: 'Temp' },
  nitrate: { target: 0, min: 0, max: 40, unit: 'ppm', label: 'NO₃' },
  nitrite: { target: 0, min: 0, max: 1, unit: 'ppm', label: 'NO₂' },
  copper: { target: 0, min: 0, max: 0.3, unit: 'ppm', label: 'Cu' },
  iron: { target: 0, min: 0, max: 0.3, unit: 'ppm', label: 'Fe' },
  lead: { target: 0, min: 0, max: 0, unit: 'ppm', label: 'Pb' },
  nickel: { target: 0, min: 0, max: 0.1, unit: 'ppm', label: 'Ni' },
  bromine: { target: null, min: 0, max: 10, unit: 'ppm', label: 'Br' },
  mps: { target: null, min: 0, max: 50, unit: 'ppm', label: 'MPS' },
  sulfite: { target: null, min: 0, max: 10, unit: 'ppm', label: 'SO₃' },
};

const PARAM_GROUPS = {
  primary: ['ph', 'ta', 'fac', 'tac', 'cc', 'ch', 'salt'],
  stability: ['cya', 'carbonate', 'phosphates'],
  environmental: ['temp'],
  contaminants: ['nitrate', 'nitrite', 'copper', 'iron', 'lead', 'nickel'],
  unused: ['bromine', 'mps', 'sulfite'],
};

const DOSING = {
  salt: { perUnit: 228, unit: 'cups' },
  dichlor: { perUnit: 1.2, unit: 'tsp', cyaPerUnit: 0.9 },
  bisulfate: { phEffect: -0.15, taEffect: -5, unit: 'TBSP' },
  carbonate: { phEffect: 0.1, taEffect: 8, unit: 'TBSP' },
  bicarbonate: { taEffect: 7, unit: 'TBSP' },
};

const CHEMICALS = [
  { id: 'salt', name: 'Salt (FreshWater)', unit: 'cups' },
  { id: 'dichlor', name: 'Dichlor (chlorine)', unit: 'tsp' },
  { id: 'bisulfate', name: 'Sodium Bisulfate (pH down)', unit: 'TBSP' },
  { id: 'carbonate', name: 'Sodium Carbonate (pH up)', unit: 'TBSP' },
  { id: 'bicarbonate', name: 'Sodium Bicarbonate (TA up)', unit: 'TBSP' },
  { id: 'mps', name: 'MPS Oxidizer', unit: 'TBSP' },
  { id: 'defoamer', name: 'Defoamer', unit: 'capful' },
  { id: 'other', name: 'Other', unit: '' },
];

const OPERATIONAL_TARGETS = { ph: 7.2, ta: 80, fac: 4, salt: 1750 };

const INITIAL_META = {
  installDate: '2024-12-01',
  lastDrain: '2025-01-10',
  cartridgeInstall: '2024-12-22',
  cumulativeCYA: 0,
};

// ============================================================================
// UTILITIES
// ============================================================================

const storage = {
  async get(key) {
    try {
      const res = await window.storage.get(key);
      return res?.value ? JSON.parse(res.value) : null;
    } catch { return null; }
  },
  async set(key, data) {
    await window.storage.set(key, JSON.stringify(data));
  }
};

const roundToIncrement = (value, increment) => Math.round(value / increment) * increment;
const roundChemical = (amount, unit) => {
  if (unit === 'TBSP') return roundToIncrement(amount, 0.5);
  if (unit === 'tsp') return roundToIncrement(amount, 0.25);
  if (unit === 'cups') return roundToIncrement(amount, 0.25);
  return Math.round(amount * 10) / 10;
};

// DRY utility: Apply treatment effects to current readings (v3.10)
const applyTreatmentEffects = (currentReadings, treatmentsList, afterDate = 0) => {
  let ph = currentReadings.ph != null ? parseFloat(currentReadings.ph) : null;
  let ta = currentReadings.ta != null ? parseFloat(currentReadings.ta) : null;
  let fac = currentReadings.fac != null ? parseFloat(currentReadings.fac) : null;
  let tac = currentReadings.tac != null ? parseFloat(currentReadings.tac) : null;
  let salt = currentReadings.salt != null ? parseFloat(currentReadings.salt) : null;
  let hasDichlorAdd = false;
  let hasShockLogged = false;
  
  const pendingTreatments = treatmentsList.filter(t => new Date(t.date).getTime() > afterDate);
  
  pendingTreatments.forEach(t => {
    const amount = parseFloat(t.amount) || 0;
    const chemId = t.chemicalId || '';
    const chemName = (t.chemical || '').toLowerCase();
    
    if (chemId === 'bisulfate' && ph != null) {
      ph = Math.round((ph + amount * DOSING.bisulfate.phEffect) * 10) / 10;
      if (ta != null) ta = Math.round(ta + amount * DOSING.bisulfate.taEffect);
    } else if (chemId === 'carbonate' && ph != null) {
      ph = Math.round((ph + amount * DOSING.carbonate.phEffect) * 10) / 10;
      if (ta != null) ta = Math.round(ta + amount * DOSING.carbonate.taEffect);
    } else if (chemId === 'bicarbonate' && ta != null) {
      ta = Math.round(ta + amount * DOSING.bicarbonate.taEffect);
    } else if (chemId === 'dichlor') {
      const delta = amount * DOSING.dichlor.perUnit;
      if (fac != null) fac = Math.round((fac + delta) * 10) / 10;
      if (tac != null) tac = Math.round((tac + delta) * 10) / 10;
      hasDichlorAdd = true;
      if (chemName.includes('shock')) hasShockLogged = true;
    } else if (chemId === 'salt' && salt != null) {
      salt = Math.round(salt + amount * DOSING.salt.perUnit);
    }
  });
  
  return { ph, ta, fac, tac, salt, hasDichlorAdd, hasShockLogged };
};

const daysSince = (dateStr) => {
  if (!dateStr) return null;
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / MS_PER_DAY);
};

const formatDuration = (minutes) => {
  if (minutes < 60) return `${minutes} min`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
};

const formatTimeAgo = (dateStr) => {
  if (!dateStr) return 'never';
  const days = daysSince(dateStr);
  if (days === 0) return 'today';
  if (days === 1) return '1d ago';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
};

// #17: Date format YYYY/MM/DD HH:MM AM/PM
const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = d.getHours();
  const mins = String(d.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const h12 = hours % 12 || 12;
  return `${year}/${month}/${day} ${h12}:${mins} ${ampm}`;
};

// ============================================================================
// CHEMISTRY SOLVER
// ============================================================================

const solvePhTa = (phCurrent, taCurrent) => {
  const phTarget = OPERATIONAL_TARGETS.ph;
  const taTarget = OPERATIONAL_TARGETS.ta;
  const taMin = TARGETS.ta.min;
  const taMax = TARGETS.ta.max;
  
  const deltaPh = phTarget - phCurrent;
  const deltaTa = taTarget - taCurrent;
  
  if (deltaPh < -0.05) {
    const B = -deltaPh / 0.15;
    const taEffectFromB = -5 * B;
    const taAfterB = taCurrent + taEffectFromB;
    const remainingTa = taTarget - taAfterB;
    
    if (remainingTa > 0) {
      const N = remainingTa / 7;
      return {
        feasible: true,
        chemicals: [
          { id: 'bisulfate', amount: B, unit: 'TBSP' },
          { id: 'bicarbonate', amount: N, unit: 'TBSP' },
        ],
        projected: { ph: phTarget, ta: taTarget },
        strategy: 'direct',
      };
    } else if (taAfterB >= taMin) {
      return {
        feasible: true,
        chemicals: [{ id: 'bisulfate', amount: B, unit: 'TBSP' }],
        projected: { ph: phTarget, ta: taAfterB },
        strategy: 'direct',
      };
    } else {
      const maxTaDrop = taCurrent - taMin;
      const maxB = maxTaDrop / 5;
      const actualB = Math.min(B, maxB);
      const actualPh = phCurrent - 0.15 * actualB;
      const taAfterLimitedB = taCurrent - 5 * actualB;
      const N = Math.max(0, (taTarget - taAfterLimitedB) / 7);
      
      return {
        feasible: true,
        chemicals: [
          { id: 'bisulfate', amount: actualB, unit: 'TBSP' },
          { id: 'bicarbonate', amount: N, unit: 'TBSP' },
        ],
        projected: { ph: actualPh, ta: taAfterLimitedB + 7 * N },
        strategy: 'limited',
      };
    }
  }
  
  if (deltaPh > 0.05) {
    const C = deltaPh / 0.10;
    const taEffectFromC = 8 * C;
    const taAfterC = taCurrent + taEffectFromC;
    
    if (taAfterC <= taMax) {
      const remainingTa = taTarget - taAfterC;
      if (remainingTa > 0) {
        const N = remainingTa / 7;
        return {
          feasible: true,
          chemicals: [
            { id: 'carbonate', amount: C, unit: 'TBSP' },
            { id: 'bicarbonate', amount: N, unit: 'TBSP' },
          ],
          projected: { ph: phTarget, ta: taTarget },
          strategy: 'direct',
        };
      }
      return {
        feasible: true,
        chemicals: [{ id: 'carbonate', amount: C, unit: 'TBSP' }],
        projected: { ph: phTarget, ta: taAfterC },
        strategy: 'direct',
      };
    }
    
    return {
      feasible: false,
      chemicals: [],
      projected: { ph: phCurrent, ta: taCurrent },
      strategy: 'aeration',
    };
  }
  
  if (deltaTa > 5) {
    const N = deltaTa / 7;
    return {
      feasible: true,
      chemicals: [{ id: 'bicarbonate', amount: N, unit: 'TBSP' }],
      projected: { ph: phCurrent, ta: taTarget },
      strategy: 'direct',
    };
  }
  
  if (deltaTa < -5) {
    return {
      feasible: true,
      chemicals: [],
      projected: { ph: phCurrent, ta: taCurrent },
      strategy: 'sequential',
      note: 'TA high but pH on target. Use bisulfate sparingly, retest.',
    };
  }
  
  return { feasible: true, chemicals: [], projected: { ph: phCurrent, ta: taCurrent }, strategy: 'none' };
};

const calculateAerationK = (phBefore, phAfter, durationHours, ta) => {
  if (durationHours <= 0) return 0;
  const deltaPh = phAfter - phBefore;
  const bufferFactor = 100 / ta;
  return deltaPh / (durationHours * bufferFactor);
};

const estimateAerationTime = (phCurrent, phTarget, ta, kCalibrated = 0.10) => {
  if (phCurrent >= phTarget) return 0;
  const bufferFactor = 100 / ta;
  return (phTarget - phCurrent) / (kCalibrated * bufferFactor);
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function ReadingCard({ param, value, lastTested, darkMode, isStale, isDerived, projectedValue, isEstimate }) {
  const t = TARGETS[param];
  if (!t) return null;
  
  // Use projected value for status if available, otherwise use actual
  const displayValue = projectedValue != null ? projectedValue : value;
  const hasProjection = projectedValue != null && projectedValue !== value;
  
  const getStatus = (v) => {
    if (v === '' || v == null) return 'gray';
    const num = parseFloat(v);
    if (isNaN(num)) return 'gray';
    
    // CYA has specific thresholds: 0-50 green, 51-100 yellow, >100 red
    if (param === 'cya') {
      if (num > t.hardMax) return 'red';      // >100: chlorine lock
      if (num > t.max) return 'yellow';        // 51-100: elevated
      return 'green';                          // 0-50: acceptable (0 is ideal)
    }
    
    // Temperature is informational only; only flag safety limit
    if (param === 'temp') {
      if (num > t.max) return 'red';           // >104°F: safety limit
      return 'green';                          // Any safe temp is fine
    }
    
    // Generic logic for other parameters
    if (num >= t.min && num <= t.max) return 'green';
    if (num < t.min * 0.8 || num > t.max * 1.2) return 'red';
    return 'yellow';
  };
  
  const status = getStatus(displayValue);
  const statusStyles = {
    green: darkMode ? 'bg-emerald-900/50 border-emerald-700 text-emerald-200' : 'bg-emerald-50 border-emerald-300 text-emerald-800',
    yellow: darkMode ? 'bg-amber-900/50 border-amber-700 text-amber-200' : 'bg-amber-50 border-amber-300 text-amber-800',
    red: darkMode ? 'bg-red-900/50 border-red-700 text-red-200' : 'bg-red-50 border-red-300 text-red-800',
    gray: darkMode ? 'bg-slate-800 border-slate-600 text-slate-400' : 'bg-slate-100 border-slate-300 text-slate-500',
  };
  
  // Pulsing border for projected values awaiting verification
  const projectionStyle = hasProjection ? (darkMode ? 'ring-1 ring-blue-500/50' : 'ring-1 ring-blue-400/50') : '';
  
  return (
    <div className={`p-2 rounded border ${statusStyles[status]} ${isStale && !hasProjection ? 'opacity-60' : ''} ${projectionStyle}`}>
      <div className="flex justify-between items-baseline">
        <span className="text-xs font-medium">{t.label}</span>
        <span className="tabular-nums text-sm font-semibold">
          {hasProjection ? (
            <>
              <span className="opacity-50 line-through mr-1">{value}</span>
              <span>{projectedValue}</span>
            </>
          ) : (
            displayValue != null && displayValue !== '' ? displayValue : '—'
          )}
          {t.unit && displayValue != null && displayValue !== '' && <span className="text-xs font-normal ml-0.5">{t.unit}</span>}
        </span>
      </div>
      <div className={`text-xs mt-0.5 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
        {hasProjection ? (
          <span className={darkMode ? 'text-blue-400' : 'text-blue-600'}>⏳ projected</span>
        ) : isEstimate ? (
          <span>~est</span>
        ) : isDerived ? (
          '(calc)'
        ) : (
          <>
            {lastTested ? formatTimeAgo(lastTested) : '—'}
            {isStale && !isDerived && ' ⚠️'}
          </>
        )}
      </div>
    </div>
  );
}

// #3: Clarified that projections are combined result
function RecommendationCard({ rec, onDidIt, darkMode, isPending }) {
  const bgColor = isPending
    ? (darkMode ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 border-blue-200')
    : rec.priority === 'high' 
      ? (darkMode ? 'bg-red-900/30 border-red-700' : 'bg-red-50 border-red-200')
      : (darkMode ? 'bg-amber-900/30 border-amber-700' : 'bg-amber-50 border-amber-200');
  
  // #21: Softer button for light mode
  const btnColor = darkMode 
    ? 'bg-blue-600 hover:bg-blue-500 text-white' 
    : 'bg-slate-700 hover:bg-slate-800 text-white';
  
  return (
    <div className={`p-3 rounded border ${bgColor}`}>
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm">
            {rec.chemical}
            {rec.amount && <span className="ml-1 tabular-nums">{rec.amount} {rec.unit}</span>}
          </div>
          <div className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            {isPending ? '⏳ Awaiting verification — retest to confirm' : rec.reason}
          </div>
          {rec.projected && !isPending && (
            <div className={`text-xs mt-1 ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
              → After all additions: pH {rec.projected.ph?.toFixed(1)}, TA {rec.projected.ta?.toFixed(0)} ppm
              {rec.multiStepNote && (
                <span className={`block mt-0.5 italic ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                  ⚠ {rec.multiStepNote}
                </span>
              )}
            </div>
          )}
        </div>
        {!isPending && rec.type === 'chemistry' && rec.amount && (
          <button
            onClick={() => onDidIt(rec)}
            className={`min-h-[44px] px-3 py-2 text-sm font-medium rounded ${btnColor}`}
            aria-label={`Log ${rec.chemical} treatment`}
          >
            Log
          </button>
        )}
      </div>
    </div>
  );
}

// Hook for escape key to close modals
const useEscapeKey = (handler) => {
  useEffect(() => {
    const listener = (e) => { if (e.key === 'Escape') handler(); };
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [handler]);
};

// Hook for focus trap in modals (v3.10 accessibility)
const useFocusTrap = (isOpen, containerRef) => {
  useEffect(() => {
    if (!isOpen || !containerRef?.current) return;
    
    const container = containerRef.current;
    const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusableElements = container.querySelectorAll(focusableSelector);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    // Store previously focused element to restore on close
    const previouslyFocused = document.activeElement;
    
    // Focus first element on open
    if (firstElement) {
      setTimeout(() => firstElement.focus(), 0);
    }
    
    const handleTab = (e) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };
    
    container.addEventListener('keydown', handleTab);
    
    return () => {
      container.removeEventListener('keydown', handleTab);
      // Restore focus on close
      if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
        previouslyFocused.focus();
      }
    };
  }, [isOpen, containerRef]);
};

function TreatmentModal({ rec, onSave, onCancel, darkMode }) {
  const [actual, setActual] = useState(rec.amount || '');
  const [notes, setNotes] = useState('');
  const modalRef = useRef(null);
  useEscapeKey(onCancel);
  useFocusTrap(true, modalRef);
  
  // Match by checking if rec.chemical contains the base chemical name
  // Handles variants like "Dichlor (SHOCK)" matching CHEMICALS entry "Dichlor (chlorine)"
  const chem = CHEMICALS.find(c => {
    const baseName = c.name.split('(')[0].trim().toLowerCase();
    return rec.chemical?.toLowerCase().includes(baseName);
  }) || { id: 'other', unit: rec.unit };
  
  const bg = darkMode ? 'bg-gray-800' : 'bg-white';
  const border = darkMode ? 'border-gray-600' : 'border-gray-300';
  const inputCls = `w-full p-3 rounded border ${border} ${bg} min-h-[44px] tabular-nums`;
  const btnPrimary = darkMode ? 'bg-blue-600 hover:bg-blue-500' : 'bg-slate-700 hover:bg-slate-800';
  
  return (
    <div className="modal-backdrop fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }} role="dialog" aria-modal="true" aria-labelledby="treatment-modal-title">
      <div ref={modalRef} className={`${bg} rounded-lg p-4 max-w-sm w-full border ${border}`} onClick={(e) => e.stopPropagation()}>
        <h3 id="treatment-modal-title" className="text-lg font-semibold mb-4">Log Treatment</h3>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Chemical</label>
            <div className={`p-3 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              {rec.chemical}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Recommended: {rec.amount} {rec.unit}
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                step="0.5"
                value={actual}
                onChange={e => setActual(e.target.value)}
                className={inputCls}
                placeholder="Actual amount"
              />
              <span className="text-sm">{rec.unit}</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Notes (optional)</label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className={inputCls}
              placeholder="Any observations..."
            />
          </div>
        </div>
        
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => onSave({ chemicalId: chem.id, chemical: rec.chemical, amount: actual, unit: rec.unit, notes })}
            disabled={!actual || parseFloat(actual) <= 0}
            className={`flex-1 min-h-[44px] px-4 py-2 rounded font-medium text-white ${
              actual && parseFloat(actual) > 0 ? btnPrimary : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Save
          </button>
          <button
            onClick={onCancel}
            className={`min-h-[44px] px-4 py-2 rounded font-medium border ${border}`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// #9: Aeration with start pH modal
function AerationPanel({ aerationState, aerationStartTime, aerationStartPh, latestReading, events, onStart, onStop, darkMode }) {
  const [elapsed, setElapsed] = useState(0);
  const [showStartModal, setShowStartModal] = useState(false);
  const [showStopModal, setShowStopModal] = useState(false);
  const [startPh, setStartPh] = useState('');
  const [stopData, setStopData] = useState({ ph: '', ta: '' });
  const startModalRef = useRef(null);
  const stopModalRef = useRef(null);
  
  // Escape key handler
  useEscapeKey(() => {
    if (showStartModal) setShowStartModal(false);
    if (showStopModal) setShowStopModal(false);
  });
  
  // Focus traps for modals
  useFocusTrap(showStartModal, startModalRef);
  useFocusTrap(showStopModal, stopModalRef);
  
  useEffect(() => {
    if (aerationState !== 'aerating' || !aerationStartTime) return;
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - aerationStartTime) / 60000));
    }, 1000);
    return () => clearInterval(interval);
  }, [aerationState, aerationStartTime]);
  
  const kCalibrated = useMemo(() => {
    const calibrationEvents = events.filter(e => e.type === 'aeration_calibration' && typeof e.k_observed === 'number');
    if (calibrationEvents.length === 0) return 0.10;
    return calibrationEvents.reduce((sum, e) => sum + e.k_observed, 0) / calibrationEvents.length;
  }, [events]);
  
  // Last aeration event for feedback
  const lastAeration = useMemo(() => {
    const aerationEvents = events.filter(e => e.type === 'aeration' || e.type === 'aeration_calibration');
    if (aerationEvents.length === 0) return null;
    return aerationEvents.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  }, [events]);
  
  const ta = parseFloat(latestReading?.ta) || 80;
  const currentPh = parseFloat(latestReading?.ph) || 7.0;
  
  const projectedPh = aerationState === 'aerating' 
    ? Math.min(8.4, (aerationStartPh || currentPh) + kCalibrated * (100 / ta) * (elapsed / 60))
    : null;
  
  const bg = darkMode ? 'bg-gray-800' : 'bg-white';
  const bgAlt = darkMode ? 'bg-gray-800' : 'bg-gray-50';
  const border = darkMode ? 'border-gray-700' : 'border-gray-200';
  const inputCls = `w-full p-2 rounded border ${border} ${bg} min-h-[44px] tabular-nums`;
  const btnPrimary = darkMode ? 'bg-blue-600 hover:bg-blue-500' : 'bg-slate-700 hover:bg-slate-800';
  
  const handleStartClick = () => {
    setStartPh(latestReading?.ph || '');
    setShowStartModal(true);
  };
  
  const handleConfirmStart = () => {
    const ph = startPh ? parseFloat(startPh) : null;
    onStart(ph);
    setShowStartModal(false);
    setStartPh('');
  };
  
  const handleStopClick = () => {
    setStopData({ ph: '', ta: latestReading?.ta || '' });
    setShowStopModal(true);
  };
  
  const handleConfirmStop = () => {
    const phAfter = stopData.ph ? parseFloat(stopData.ph) : null;
    const taValue = stopData.ta ? parseFloat(stopData.ta) : 80;
    onStop(phAfter, taValue);
    setShowStopModal(false);
    setStopData({ ph: '', ta: '' });
  };
  
  return (
    <>
      <div className={`p-3 rounded border ${border} ${bgAlt}`}>
        <div className="flex justify-between items-center">
          <div>
            <div className="font-medium text-sm">Aeration</div>
            {aerationState === 'aerating' ? (
              <div className="text-xs mt-1">
                <span className="tabular-nums">{formatDuration(elapsed)}</span>
                {aerationStartPh && <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}> • Start pH {aerationStartPh.toFixed(1)}</span>}
                {projectedPh && (
                  <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
                    {' '}→ {projectedPh.toFixed(2)}
                  </span>
                )}
              </div>
            ) : (
              <div className={`text-xs mt-1 ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                {lastAeration ? (
                  <>
                    Last: {formatTimeAgo(lastAeration.date)}
                    {lastAeration.duration_min && ` (${formatDuration(lastAeration.duration_min)})`}
                    {lastAeration.type === 'aeration_calibration' && lastAeration.ph_before && lastAeration.ph_after && (
                      <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
                        {' '}• pH {lastAeration.ph_before.toFixed(1)} → {lastAeration.ph_after.toFixed(1)}
                      </span>
                    )}
                  </>
                ) : 'Not active'}
                {kCalibrated !== 0.10 && ` • k=${kCalibrated.toFixed(2)}`}
              </div>
            )}
          </div>
          <button
            onClick={aerationState === 'aerating' ? handleStopClick : handleStartClick}
            className={`min-h-[44px] px-4 py-2 text-sm font-medium rounded ${
              aerationState === 'aerating'
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : (darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300')
            }`}
            aria-label={aerationState === 'aerating' ? 'Stop aeration and log duration' : 'Start aeration timer'}
          >
            {aerationState === 'aerating' ? 'Stop' : 'Start'}
          </button>
        </div>
      </div>
      
      {/* Start Aeration Modal */}
      {showStartModal && (
        <div className="modal-backdrop fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={(e) => { if (e.target === e.currentTarget) setShowStartModal(false); }} role="dialog" aria-modal="true" aria-labelledby="start-aeration-title">
          <div ref={startModalRef} className={`${bg} rounded-lg p-4 max-w-sm w-full border ${border}`} onClick={(e) => e.stopPropagation()}>
            <h3 id="start-aeration-title" className="text-lg font-semibold mb-2">Start Aeration</h3>
            <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'} mb-4`}>
              Enter current pH for calibration tracking. Leave blank to skip.
            </p>
            
            <div className="space-y-3">
              <div>
                <label className={`block text-sm font-medium mb-1`}>Starting pH (optional)</label>
                <input
                  type="number"
                  step="0.1"
                  min="6"
                  max="9"
                  value={startPh}
                  onChange={e => setStartPh(e.target.value)}
                  className={inputCls}
                  placeholder={latestReading?.ph || "7.0"}
                />
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleConfirmStart}
                className={`flex-1 min-h-[44px] px-4 py-2 rounded font-medium text-white ${btnPrimary}`}
              >
                Start
              </button>
              <button
                onClick={() => setShowStartModal(false)}
                className={`min-h-[44px] px-4 py-2 rounded font-medium border ${border}`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Stop Aeration Modal */}
      {showStopModal && (
        <div className="modal-backdrop fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={(e) => { if (e.target === e.currentTarget) setShowStopModal(false); }} role="dialog" aria-modal="true" aria-labelledby="stop-aeration-title">
          <div ref={stopModalRef} className={`${bg} rounded-lg p-4 max-w-sm w-full border ${border}`} onClick={(e) => e.stopPropagation()}>
            <h3 id="stop-aeration-title" className="text-lg font-semibold mb-2">Log Aeration</h3>
            <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'} mb-4`}>
              Duration: {formatDuration(elapsed)}
              {aerationStartPh && ` • Started at pH ${aerationStartPh.toFixed(1)}`}
            </p>
            
            <div className="space-y-3">
              <div>
                <label className={`block text-sm font-medium mb-1`}>
                  Current pH <span className={`font-normal ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>(for calibration)</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="6"
                  max="9"
                  value={stopData.ph}
                  onChange={e => setStopData(prev => ({ ...prev, ph: e.target.value }))}
                  className={inputCls}
                  placeholder="Measure now"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1`}>Current TA (ppm)</label>
                <input
                  type="number"
                  value={stopData.ta}
                  onChange={e => setStopData(prev => ({ ...prev, ta: e.target.value }))}
                  className={inputCls}
                  placeholder={latestReading?.ta || '80'}
                />
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleConfirmStop}
                className={`flex-1 min-h-[44px] px-4 py-2 rounded font-medium text-white ${btnPrimary}`}
              >
                Save
              </button>
              <button
                onClick={() => setShowStopModal(false)}
                className={`min-h-[44px] px-4 py-2 rounded font-medium border ${border}`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// #1/12/4: Maintenance panel with action buttons
function MaintenancePanel({ meta, estimatedCYA, onDrainFill, onCartridgeReplace, darkMode }) {
  const today = new Date().toISOString().split('T')[0];
  const [showDrainModal, setShowDrainModal] = useState(false);
  const [showCartridgeModal, setShowCartridgeModal] = useState(false);
  const [drainDate, setDrainDate] = useState(today);
  const [resetCya, setResetCya] = useState(true);
  const [cartridgeDate, setCartridgeDate] = useState(today);
  const drainModalRef = useRef(null);
  const cartridgeModalRef = useRef(null);
  
  // Escape key handler
  useEscapeKey(() => {
    if (showDrainModal) setShowDrainModal(false);
    if (showCartridgeModal) setShowCartridgeModal(false);
  });
  
  // Focus traps for modals
  useFocusTrap(showDrainModal, drainModalRef);
  useFocusTrap(showCartridgeModal, cartridgeModalRef);
  
  const cartridgeDaysLeft = meta.cartridgeInstall 
    ? Math.floor((new Date(meta.cartridgeInstall).getTime() + 120 * MS_PER_DAY - Date.now()) / MS_PER_DAY)
    : null;
  
  const drainDays = daysSince(meta.lastDrain);
  const daysUntilDrain = drainDays !== null ? 365 - drainDays : null;
  
  const bg = darkMode ? 'bg-gray-800' : 'bg-white';
  const bgAlt = darkMode ? 'bg-gray-800' : 'bg-gray-50';
  const border = darkMode ? 'border-gray-700' : 'border-gray-200';
  const textMuted = darkMode ? 'text-slate-400' : 'text-slate-600';
  const inputCls = `w-full p-2 rounded border ${border} ${bg} min-h-[44px]`;
  const btnPrimary = darkMode ? 'bg-blue-600 hover:bg-blue-500' : 'bg-slate-700 hover:bg-slate-800';
  
  const getCartridgeStatus = () => {
    if (cartridgeDaysLeft === null) return { level: 'gray', text: 'Cartridge: not set' };
    if (cartridgeDaysLeft <= 0) return { level: 'high', text: `Cartridge expired` };
    if (cartridgeDaysLeft <= 14) return { level: 'medium', text: `Cartridge: ${cartridgeDaysLeft}d left` };
    return { level: 'ok', text: `Cartridge: ${cartridgeDaysLeft}d left` };
  };
  
  const getDrainStatus = () => {
    if (drainDays === null) return { level: 'gray', text: 'Last drain: not set' };
    if (daysUntilDrain <= 0) return { level: 'high', text: `Drain overdue` };
    if (daysUntilDrain <= 30) return { level: 'medium', text: `Drain in ${daysUntilDrain}d` };
    return { level: 'ok', text: `Last drain: ${drainDays}d ago` };
  };
  
  const cartridge = getCartridgeStatus();
  const drain = getDrainStatus();
  
  const levelColors = {
    high: darkMode ? 'text-red-400' : 'text-red-600',
    medium: darkMode ? 'text-amber-400' : 'text-amber-600',
    ok: darkMode ? 'text-slate-400' : 'text-slate-600',
    gray: darkMode ? 'text-slate-500' : 'text-slate-400',
  };
  
  const handleDrainSave = () => {
    onDrainFill(drainDate, resetCya);
    setShowDrainModal(false);
  };
  
  const handleCartridgeSave = () => {
    onCartridgeReplace(cartridgeDate);
    setShowCartridgeModal(false);
  };
  
  return (
    <>
      <div className={`p-3 rounded border ${border} ${bgAlt}`}>
        <div className="font-medium text-sm mb-2">Maintenance</div>
        <div className="space-y-2">
          {/* Cartridge row */}
          <div className="flex justify-between items-center">
            <span className={`text-xs ${levelColors[cartridge.level]}`}>
              {cartridge.level === 'high' && '⚠️ '}{cartridge.text}
            </span>
            <button
              onClick={() => { setCartridgeDate(today); setShowCartridgeModal(true); }}
              className={`min-h-[36px] px-2 py-1 text-xs font-medium rounded ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              Replace
            </button>
          </div>
          
          {/* Drain row */}
          <div className="flex justify-between items-center">
            <span className={`text-xs ${levelColors[drain.level]}`}>
              {drain.level === 'high' && '⚠️ '}{drain.text}
            </span>
            <button
              onClick={() => { setDrainDate(today); setResetCya(true); setShowDrainModal(true); }}
              className={`min-h-[36px] px-2 py-1 text-xs font-medium rounded ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              Log Drain
            </button>
          </div>
          
          {/* CYA warning */}
          {estimatedCYA > 80 && (
            <div className={`text-xs ${estimatedCYA > 100 ? levelColors.high : levelColors.medium}`}>
              {estimatedCYA > 100 ? '⚠️ ' : ''}CYA ~{estimatedCYA} ppm {estimatedCYA > 100 ? '— drain required' : '— plan drain'}
            </div>
          )}
        </div>
      </div>
      
      {/* Drain/Fill Modal */}
      {showDrainModal && (
        <div className="modal-backdrop fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={(e) => { if (e.target === e.currentTarget) setShowDrainModal(false); }} role="dialog" aria-modal="true" aria-labelledby="drain-modal-title">
          <div ref={drainModalRef} className={`${bg} rounded-lg p-4 max-w-sm w-full border ${border}`} onClick={(e) => e.stopPropagation()}>
            <h3 id="drain-modal-title" className="text-lg font-semibold mb-4">Log Drain & Fill</h3>
            
            <div className="space-y-3">
              <div>
                <label className={`block text-sm font-medium mb-1`}>Date</label>
                <input
                  type="date"
                  value={drainDate}
                  onChange={e => setDrainDate(e.target.value)}
                  className={inputCls}
                />
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={resetCya}
                  onChange={e => setResetCya(e.target.checked)}
                  className="w-5 h-5"
                />
                <span className="text-sm">Reset CYA accumulator to 0</span>
              </label>
            </div>
            
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleDrainSave}
                className={`flex-1 min-h-[44px] px-4 py-2 rounded font-medium text-white ${btnPrimary}`}
              >
                Save
              </button>
              <button
                onClick={() => setShowDrainModal(false)}
                className={`min-h-[44px] px-4 py-2 rounded font-medium border ${border}`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Cartridge Modal */}
      {showCartridgeModal && (
        <div className="modal-backdrop fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={(e) => { if (e.target === e.currentTarget) setShowCartridgeModal(false); }} role="dialog" aria-modal="true" aria-labelledby="cartridge-modal-title">
          <div ref={cartridgeModalRef} className={`${bg} rounded-lg p-4 max-w-sm w-full border ${border}`} onClick={(e) => e.stopPropagation()}>
            <h3 id="cartridge-modal-title" className="text-lg font-semibold mb-4">Replace Cartridge</h3>
            
            <div className="space-y-3">
              <div>
                <label className={`block text-sm font-medium mb-1`}>Installation Date</label>
                <input
                  type="date"
                  value={cartridgeDate}
                  onChange={e => setCartridgeDate(e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleCartridgeSave}
                className={`flex-1 min-h-[44px] px-4 py-2 rounded font-medium text-white ${btnPrimary}`}
              >
                Save
              </button>
              <button
                onClick={() => setShowCartridgeModal(false)}
                className={`min-h-[44px] px-4 py-2 rounded font-medium border ${border}`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// #16: Units in entry form labels
function ReadingEntryForm({ onSave, darkMode, initialValues = {} }) {
  const [values, setValues] = useState({
    ph: '', ta: '', fac: '', tac: '', ch: '', salt: '',
    cya: '', carbonate: '', phosphates: '', temp: '',
    nitrate: '', nitrite: '', copper: '', iron: '', lead: '', nickel: '',
    bromine: '', mps: '', sulfite: '',
    ...initialValues,
  });
  const [showContaminants, setShowContaminants] = useState(false);
  const [showUnused, setShowUnused] = useState(false);
  const [error, setError] = useState(null);
  
  const handleChange = (param, value) => {
    setValues(prev => ({ ...prev, [param]: value }));
    setError(null);
  };
  
  const handleSave = () => {
    if (values.ph !== '' && values.ph != null) {
      const ph = parseFloat(values.ph);
      if (isNaN(ph) || ph < 6 || ph > 9) {
        setError('pH must be between 6.0 and 9.0');
        return;
      }
    }
    
    const hasValue = Object.values(values).some(v => v !== '' && v != null);
    if (!hasValue) {
      setError('Enter at least one reading');
      return;
    }
    
    onSave(values);
    setValues({
      ph: '', ta: '', fac: '', tac: '', ch: '', salt: '',
      cya: '', carbonate: '', phosphates: '', temp: '',
      nitrate: '', nitrite: '', copper: '', iron: '', lead: '', nickel: '',
      bromine: '', mps: '', sulfite: '',
    });
  };
  
  const bg = darkMode ? 'bg-gray-800' : 'bg-white';
  const bgAlt = darkMode ? 'bg-gray-700' : 'bg-gray-50';
  const border = darkMode ? 'border-gray-600' : 'border-gray-300';
  const inputCls = `w-full p-2 rounded border ${border} ${bg} text-sm min-h-[44px] tabular-nums`;
  const btnPrimary = darkMode ? 'bg-blue-600 hover:bg-blue-500' : 'bg-slate-700 hover:bg-slate-800';
  
  // #16: Show units in labels
  const renderInputGroup = (params, label = null) => (
    <div className="space-y-2">
      {label && <div className={`text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{label}</div>}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {params.filter(p => !TARGETS[p]?.derived).map(param => {
          const t = TARGETS[param];
          const labelText = t?.unit ? `${t.label} (${t.unit})` : t?.label || param;
          return (
            <div key={param}>
              <label className={`block text-xs mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                {labelText}
              </label>
              <input
                type="number"
                step="0.1"
                value={values[param] || ''}
                onChange={e => handleChange(param, e.target.value)}
                className={inputCls}
                placeholder="—"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
  
  return (
    <div className={`p-3 rounded border ${border} ${bgAlt}`}>
      <div className="font-medium text-sm mb-3">Log Readings</div>
      
      <div className="space-y-4">
        {renderInputGroup(PARAM_GROUPS.primary.filter(p => p !== 'cc'), 'Primary')}
        {renderInputGroup([...PARAM_GROUPS.stability, ...PARAM_GROUPS.environmental], 'Stability & Temp')}
        
        {/* #20: Block containers for collapsible sections */}
        <div>
          <button
            onClick={() => setShowContaminants(!showContaminants)}
            className={`collapse-trigger text-xs ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
          >
            {showContaminants ? '▼' : '▶'} Contaminants
          </button>
          {showContaminants && <div className="mt-2">{renderInputGroup(PARAM_GROUPS.contaminants)}</div>}
        </div>
        
        <div>
          <button
            onClick={() => setShowUnused(!showUnused)}
            className={`collapse-trigger text-xs ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
          >
            {showUnused ? '▼' : '▶'} Other
          </button>
          {showUnused && <div className="mt-2">{renderInputGroup(PARAM_GROUPS.unused)}</div>}
        </div>
      </div>
      
      {error && <div className="text-red-500 text-xs mt-2">{error}</div>}
      
      <button
        onClick={handleSave}
        className={`mt-4 w-full min-h-[44px] px-4 py-2 rounded font-medium text-white ${btnPrimary}`}
      >
        Save Readings
      </button>
    </div>
  );
}

// #13/14: Unified history entry component
function HistoryEntry({ entry, darkMode }) {
  const border = darkMode ? 'border-gray-700' : 'border-gray-200';
  const bgAlt = darkMode ? 'bg-gray-800' : 'bg-gray-50';
  const textMuted = darkMode ? 'text-gray-400' : 'text-gray-500';
  
  const badges = {
    reading: { icon: '📊', label: 'Reading' },
    treatment: { icon: '💊', label: 'Treatment' },
    aeration: { icon: '💨', label: 'Aeration' },
    aeration_calibration: { icon: '💨', label: 'Aeration' },
    drain: { icon: '🔧', label: 'Drain/Fill' },
    cartridge: { icon: '🔧', label: 'Cartridge' },
  };
  
  const badge = badges[entry.entryType] || { icon: '•', label: entry.entryType };
  
  const renderContent = () => {
    switch (entry.entryType) {
      case 'reading':
        return (
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 tabular-nums text-xs">
            {PARAM_GROUPS.primary.filter(p => p !== 'cc' && entry[p]).map(p => (
              <span key={p}>{TARGETS[p].label}: {entry[p]}{TARGETS[p].unit && ` ${TARGETS[p].unit}`}</span>
            ))}
            {PARAM_GROUPS.stability.filter(p => entry[p]).map(p => (
              <span key={p}>{TARGETS[p].label}: {entry[p]}{TARGETS[p].unit && ` ${TARGETS[p].unit}`}</span>
            ))}
            {PARAM_GROUPS.environmental.filter(p => entry[p]).map(p => (
              <span key={p}>{TARGETS[p].label}: {entry[p]}{TARGETS[p].unit && ` ${TARGETS[p].unit}`}</span>
            ))}
          </div>
        );
      case 'treatment':
        return (
          <div className="mt-1 text-xs">
            {entry.chemical}: <span className="tabular-nums">{entry.amount} {entry.unit}</span>
            {entry.notes && <span className={textMuted}> — {entry.notes}</span>}
          </div>
        );
      case 'aeration':
      case 'aeration_calibration':
        return (
          <div className="mt-1 text-xs">
            Duration: {formatDuration(entry.duration_min)}
            {entry.ph_before && entry.ph_after && (
              <span> • pH {entry.ph_before.toFixed(1)} → {entry.ph_after.toFixed(1)}</span>
            )}
            {entry.k_observed && <span className={textMuted}> (k={entry.k_observed.toFixed(3)})</span>}
          </div>
        );
      case 'drain':
        return (
          <div className="mt-1 text-xs">
            Drain & refill completed
            {entry.resetCya && <span className={textMuted}> • CYA reset</span>}
          </div>
        );
      case 'cartridge':
        return (
          <div className="mt-1 text-xs">
            Salt cartridge replaced
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className={`p-2 rounded border ${border} ${bgAlt} text-xs`}>
      <div className="flex items-center gap-2">
        <span>{badge.icon}</span>
        <span className={`font-medium ${textMuted}`}>{formatDate(entry.date)}</span>
        <span className={`text-xs px-1.5 py-0.5 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
          {badge.label}
        </span>
      </div>
      {renderContent()}
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function HotTubDashboard() {
  const [view, setView] = useState('status');
  const [readings, setReadings] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [events, setEvents] = useState([]);
  const [meta, setMeta] = useState(INITIAL_META);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [saveError, setSaveError] = useState(null);
  
  const [showEntry, setShowEntry] = useState(false);
  const [treatmentModal, setTreatmentModal] = useState(null);
  const [historyLimit, setHistoryLimit] = useState(25); // Pagination state
  
  const [aerationState, setAerationState] = useState('idle');
  const [aerationStartTime, setAerationStartTime] = useState(null);
  const [aerationStartPh, setAerationStartPh] = useState(null);
  
  const latestReading = readings[readings.length - 1] || null;
  
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setDarkMode(mq.matches);
    const handler = (e) => setDarkMode(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  
  useEffect(() => {
    setIsOnline(navigator.onLine);
    const on = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);
  
  useEffect(() => {
    async function load() {
      const [r, t, e, m] = await Promise.all([
        storage.get('hottub:readings'),
        storage.get('hottub:treatments'),
        storage.get('hottub:events'),
        storage.get('hottub:meta'),
      ]);
      if (r) setReadings(r);
      if (t) setTreatments(t);
      if (e) setEvents(e);
      if (m) setMeta(m);
      setLoading(false);
    }
    load();
  }, []);
  
  const save = async (key, setter, data, previousData) => {
    setter(data);
    setSaveError(null);
    try {
      await storage.set(key, data);
    } catch (e) {
      if (previousData !== undefined) setter(previousData);
      setSaveError(`Save failed: ${e.message || 'Unknown error'}`);
    }
  };
  
  useEffect(() => {
    if (saveError) {
      const timer = setTimeout(() => setSaveError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [saveError]);
  
  // CYA from dichlor treatments AFTER last drain (drain resets accumulator)
  const estimatedCYA = useMemo(() => {
    const drainDate = meta.lastDrain ? new Date(meta.lastDrain).getTime() : 0;
    const fromTreatments = treatments
      .filter(t => {
        const isDichlor = t.chemicalId === 'dichlor' || t.chemical?.toLowerCase().includes('dichlor');
        const afterDrain = new Date(t.date).getTime() > drainDate;
        return isDichlor && afterDrain;
      })
      .reduce((sum, t) => sum + ((parseFloat(t.amount) || 0) * DOSING.dichlor.cyaPerUnit), 0);
    return Math.round((meta.cumulativeCYA || 0) + fromTreatments);
  }, [treatments, meta.cumulativeCYA, meta.lastDrain]);
  
  const calculatedCC = useMemo(() => {
    if (!latestReading?.fac || !latestReading?.tac) return null;
    const fac = parseFloat(latestReading.fac);
    const tac = parseFloat(latestReading.tac);
    if (isNaN(fac) || isNaN(tac)) return null;
    return Math.round((tac - fac) * 10) / 10;
  }, [latestReading]);
  
  const getLastTested = (param) => {
    for (let i = readings.length - 1; i >= 0; i--) {
      if (readings[i][param] !== '' && readings[i][param] != null) {
        return readings[i].date;
      }
    }
    return null;
  };
  
  const isStale = (param) => {
    const lastDate = getLastTested(param);
    if (!lastDate) return true;
    return daysSince(lastDate) > STALE_THRESHOLD_DAYS;
  };
  
  // #2: Detect pending treatments (treatment logged after latest reading)
  const hasPendingTreatment = useMemo(() => {
    if (!latestReading?.date || treatments.length === 0) return false;
    const latestReadingTime = new Date(latestReading.date).getTime();
    return treatments.some(t => new Date(t.date).getTime() > latestReadingTime);
  }, [latestReading, treatments]);
  
  // Compute projected values from pending treatments (refactored v3.10)
  const projectedReadings = useMemo(() => {
    if (!hasPendingTreatment || !latestReading) return {};
    
    const latestReadingTime = new Date(latestReading.date).getTime();
    const projected = applyTreatmentEffects(latestReading, treatments, latestReadingTime);
    
    const projections = {};
    if (projected.ph != null && projected.ph !== parseFloat(latestReading.ph)) projections.ph = projected.ph;
    if (projected.ta != null && projected.ta !== parseFloat(latestReading.ta)) projections.ta = projected.ta;
    if (projected.fac != null && projected.fac !== parseFloat(latestReading.fac)) projections.fac = projected.fac;
    if (projected.tac != null && projected.tac !== parseFloat(latestReading.tac)) projections.tac = projected.tac;
    if (projected.salt != null && projected.salt !== parseFloat(latestReading.salt)) projections.salt = projected.salt;
    if (projected.hasDichlorAdd) projections.cya = true;
    if (projected.hasShockLogged) projections._shockLogged = true;
    
    return projections;
  }, [hasPendingTreatment, latestReading, treatments]);
  
  // #6/7/8: Add recommendations for CC and CYA
  // Uses projected values when available so recommendations auto-suppress after treatment logged
  const recommendations = useMemo(() => {
    const recs = [];
    if (!latestReading) return recs;
    
    // Helper: use projected value if available, otherwise latest reading
    const getValue = (param) => {
      if (projectedReadings[param] !== undefined) return projectedReadings[param];
      const v = latestReading[param];
      return v !== '' && v != null ? parseFloat(v) : null;
    };
    
    // For display in reason text, use actual (not projected) values
    const getActualValue = (param) => {
      const v = latestReading[param];
      return v !== '' && v != null ? parseFloat(v) : null;
    };
    
    const salt = getValue('salt');
    const ph = getValue('ph');
    const ta = getValue('ta');
    const fac = getValue('fac');
    const cya = getActualValue('cya'); // CYA uses actual tested value for recommendations
    
    // Salt
    if (salt != null && salt < TARGETS.salt.min) {
      const needed = (TARGETS.salt.target - salt) / DOSING.salt.perUnit;
      recs.push({ type: 'chemistry', chemical: 'Salt', amount: roundChemical(needed, 'cups').toFixed(1), unit: 'cups', reason: 'Raise to 1750 ppm' });
    }
    if (salt != null && salt > TARGETS.salt.max) {
      recs.push({ type: 'maintenance', priority: 'high', chemical: 'Dilute', reason: `Salt ${getActualValue('salt')} ppm — drain 25%, refill` });
    }
    
    // Joint pH/TA solver - use projected values for threshold check
    // Check both "out of spec" (below min or above max) AND "significantly below target"
    const phOutOfSpec = ph != null && (ph < TARGETS.ph.min || ph > TARGETS.ph.max);
    const taOutOfSpec = ta != null && (ta < TARGETS.ta.min || ta > TARGETS.ta.max);
    // Trigger solver when TA is >5 ppm below target (matches solver's deltaTa > 5 threshold)
    // This ensures step 2 of multi-step corrections (bicarbonate after bisulfate) still appears
    const taBelowTarget = ta != null && ta < OPERATIONAL_TARGETS.ta - 5;
    
    if (ph != null && ta != null && (phOutOfSpec || taOutOfSpec || taBelowTarget)) {
      const solution = solvePhTa(ph, ta);
      
      if (solution.strategy === 'aeration') {
        const kCal = events.filter(e => e.type === 'aeration_calibration').reduce((s, e) => s + (e.k_observed || 0), 0) / Math.max(1, events.filter(e => e.type === 'aeration_calibration').length) || 0.10;
        const timeEst = estimateAerationTime(ph, OPERATIONAL_TARGETS.ph, ta, kCal);
        recs.push({
          type: 'aeration',
          priority: 'high',
          chemical: '💨 Aerate',
          reason: `pH low + TA high. Run jets with cover open (~${timeEst.toFixed(1)}h)`,
          projected: solution.projected,
        });
      } else if (solution.chemicals.length > 0) {
        // Multi-chemical solution: add sequence indicator
        const isMultiStep = solution.chemicals.length > 1;
        solution.chemicals.forEach((c, idx) => {
          const chem = CHEMICALS.find(ch => ch.id === c.id);
          recs.push({
            type: 'chemistry',
            chemical: chem?.name || c.id,
            amount: roundChemical(c.amount, c.unit).toFixed(1),
            unit: c.unit,
            reason: isMultiStep 
              ? (idx === 0 ? `Step 1 of ${solution.chemicals.length}: Adjust pH` : `Step ${idx+1} of ${solution.chemicals.length}: Adjust TA`)
              : `Adjust pH/TA`,
            projected: solution.projected,
            multiStepNote: isMultiStep ? `Projection assumes all ${solution.chemicals.length} steps completed` : null,
          });
        });
      }
    }
    
    // FAC - uses projected value, so suppresses if dichlor already logged
    if (fac != null && fac < TARGETS.fac.min) {
      const needed = (TARGETS.fac.target - fac) / DOSING.dichlor.perUnit;
      recs.push({ type: 'chemistry', chemical: 'Dichlor', amount: roundChemical(needed, 'tsp').toFixed(1), unit: 'tsp', reason: `Raise FAC to ${TARGETS.fac.target} ppm` });
    }
    
    // #7/8: CC recommendation - use projected FAC/TAC to compute projected CC
    // Suppress if shock already logged (CC reduction not modeled, but action taken)
    const projectedCC = (() => {
      const facVal = getValue('fac');
      const tacVal = getValue('tac');
      if (facVal == null || tacVal == null) return calculatedCC;
      return Math.round((tacVal - facVal) * 10) / 10;
    })();
    
    // Only recommend shock if CC high AND no shock already logged
    const shockAlreadyLogged = projectedReadings._shockLogged;
    if (projectedCC != null && projectedCC > TARGETS.cc.max && !shockAlreadyLogged) {
      const effectiveFac = fac || 0;
      const needed = Math.max((5 - effectiveFac) / DOSING.dichlor.perUnit, 3);
      recs.push({ 
        type: 'chemistry', 
        priority: 'high', 
        chemical: 'Dichlor (SHOCK)', 
        amount: roundChemical(needed, 'tsp').toFixed(1), 
        unit: 'tsp', 
        reason: `CC ${calculatedCC} ppm — shock to break chloramines` 
      });
    }
    
    // #6/8: CYA recommendation - zero is preferred per Hotspring, up to 50 acceptable
    if (cya != null) {
      if (cya > TARGETS.cya.hardMax) {
        recs.push({
          type: 'maintenance',
          priority: 'high',
          chemical: 'Drain Required',
          reason: `CYA ${cya} ppm exceeds 100 — chlorine lock, partial drain needed`,
        });
      } else if (cya > TARGETS.cya.max) {
        recs.push({
          type: 'info',
          chemical: 'CYA Elevated',
          reason: `CYA ${cya} ppm — plan drain when > 100`,
        });
      }
    }
    
    return recs;
  }, [latestReading, projectedReadings, calculatedCC, events]);
  
  // #13/14: Unified history
  const unifiedHistory = useMemo(() => {
    const all = [
      ...readings.map(r => ({ ...r, entryType: 'reading' })),
      ...treatments.map(t => ({ ...t, entryType: 'treatment' })),
      ...events.map(e => ({ ...e, date: e.end || e.date, entryType: e.type })),
    ];
    return all.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [readings, treatments, events]);
  
  const handleSaveReading = async (values) => {
    const newReading = { date: new Date().toISOString(), ...values };
    await save('hottub:readings', setReadings, [...readings, newReading], readings);
    setShowEntry(false);
  };
  
  const handleSaveTreatment = async (treatment) => {
    const newTreatment = {
      date: new Date().toISOString(),
      ...treatment,
    };
    await save('hottub:treatments', setTreatments, [...treatments, newTreatment], treatments);
    setTreatmentModal(null);
  };
  
  const handleStartAeration = (startPh) => {
    setAerationStartTime(Date.now());
    setAerationStartPh(startPh);
    setAerationState('aerating');
  };
  
  const handleStopAeration = async (phAfter, taValue) => {
    const endTime = new Date();
    const startTime = new Date(aerationStartTime);
    const durationMin = Math.round((endTime - startTime) / 60000);
    const durationHours = durationMin / 60;
    
    let newEvent;
    
    if (aerationStartPh && phAfter && durationHours > 0) {
      const kObserved = calculateAerationK(aerationStartPh, phAfter, durationHours, taValue);
      newEvent = {
        type: 'aeration_calibration',
        start: startTime.toISOString(),
        end: endTime.toISOString(),
        date: endTime.toISOString(),
        duration_min: durationMin,
        ph_before: aerationStartPh,
        ph_after: phAfter,
        ta: taValue,
        k_observed: kObserved,
      };
    } else {
      newEvent = {
        type: 'aeration',
        start: startTime.toISOString(),
        end: endTime.toISOString(),
        date: endTime.toISOString(),
        duration_min: durationMin,
      };
    }
    
    await save('hottub:events', setEvents, [...events, newEvent], events);
    
    if (phAfter) {
      const newReading = {
        date: endTime.toISOString(),
        ph: phAfter.toString(),
        ta: taValue?.toString() || '',
      };
      await save('hottub:readings', setReadings, [...readings, newReading], readings);
    }
    
    setAerationState('idle');
    setAerationStartTime(null);
    setAerationStartPh(null);
  };
  
  // #1/12/14: Drain/fill and cartridge handlers
  const handleDrainFill = async (dateStr, resetCya) => {
    const newMeta = { 
      ...meta, 
      lastDrain: dateStr,
      cumulativeCYA: resetCya ? 0 : meta.cumulativeCYA,
    };
    await save('hottub:meta', setMeta, newMeta, meta);
    
    // Log to events for history
    const newEvent = {
      type: 'drain',
      date: new Date(dateStr).toISOString(),
      resetCya,
    };
    await save('hottub:events', setEvents, [...events, newEvent], events);
    
    // If CYA reset, also clear dichlor treatments from accumulator calculation
    if (resetCya) {
      // Treatments stay in history, but meta.cumulativeCYA is reset
    }
  };
  
  const handleCartridgeReplace = async (dateStr) => {
    const newMeta = { ...meta, cartridgeInstall: dateStr };
    await save('hottub:meta', setMeta, newMeta, meta);
    
    const newEvent = {
      type: 'cartridge',
      date: new Date(dateStr).toISOString(),
    };
    await save('hottub:events', setEvents, [...events, newEvent], events);
  };
  
  // #18: Export with feedback
  const [exportStatus, setExportStatus] = useState(null);
  const exportData = () => {
    try {
      const data = { version: '3.10', exportDate: new Date().toISOString(), readings, treatments, events, meta };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const filename = `hottub-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setExportStatus(`✓ Downloaded ${filename}`);
      setTimeout(() => setExportStatus(null), 4000);
    } catch (e) {
      setExportStatus(`✗ Download failed: ${e.message || 'Unknown error'}`);
      setTimeout(() => setExportStatus(null), 4000);
    }
  };
  
  const copyToClipboard = async () => {
    try {
      const data = { version: '3.10', exportDate: new Date().toISOString(), readings, treatments, events, meta };
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setExportStatus('✓ Copied to clipboard');
      setTimeout(() => setExportStatus(null), 3000);
    } catch (e) {
      setExportStatus(`✗ Copy failed: ${e.message || 'Unknown error'}`);
      setTimeout(() => setExportStatus(null), 4000);
    }
  };
  
  const [importStatus, setImportStatus] = useState(null);
  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const data = JSON.parse(text);
      
      // Validate it looks like our data format
      if (!data.readings && !data.treatments && !data.events && !data.meta) {
        throw new Error('Invalid backup format');
      }
      
      if (data.readings) {
        await storage.set('hottub:readings', data.readings);
        setReadings(data.readings);
      }
      if (data.treatments) {
        await storage.set('hottub:treatments', data.treatments);
        setTreatments(data.treatments);
      }
      if (data.events) {
        await storage.set('hottub:events', data.events);
        setEvents(data.events);
      }
      if (data.meta) {
        await storage.set('hottub:meta', data.meta);
        setMeta(data.meta);
      }
      
      setImportStatus('✓ Imported from clipboard');
      setTimeout(() => setImportStatus(null), 3000);
    } catch (e) {
      const msg = e.message?.includes('JSON') ? 'Invalid JSON in clipboard' : 
                  e.message?.includes('permission') ? 'Clipboard access denied' :
                  e.message || 'Unknown error';
      setImportStatus(`✗ Paste failed: ${msg}`);
      setTimeout(() => setImportStatus(null), 4000);
    }
  };
  
  const importData = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (data.readings) await save('hottub:readings', setReadings, data.readings);
      if (data.treatments) await save('hottub:treatments', setTreatments, data.treatments);
      if (data.events) await save('hottub:events', setEvents, data.events);
      if (data.meta) await save('hottub:meta', setMeta, data.meta);
      alert('Import successful!');
    } catch (err) {
      alert('Import failed: ' + err.message);
    }
    e.target.value = '';
  };
  
  const [clearStatus, setClearStatus] = useState(null);
  const [showClearModal, setShowClearModal] = useState(false);
  const clearModalRef = useRef(null);
  
  // Focus trap for clear modal
  useFocusTrap(showClearModal, clearModalRef);
  
  const clearAllData = async () => {
    try {
      // Clear storage directly first, then update state
      await storage.set('hottub:readings', []);
      await storage.set('hottub:treatments', []);
      await storage.set('hottub:events', []);
      await storage.set('hottub:meta', INITIAL_META);
      
      // Update local state after storage succeeds
      setReadings([]);
      setTreatments([]);
      setEvents([]);
      setMeta(INITIAL_META);
      
      setClearStatus('✓ All data cleared');
      setShowClearModal(false);
      setTimeout(() => setClearStatus(null), 3000);
    } catch (err) {
      setClearStatus(`✗ Clear failed: ${err.message || 'Unknown error'}`);
      setShowClearModal(false);
      setTimeout(() => setClearStatus(null), 5000);
    }
  };
  
  const updateMeta = async (updates) => {
    const newMeta = { ...meta, ...updates };
    await save('hottub:meta', setMeta, newMeta, meta);
  };
  
  if (loading) return <div className="p-8 text-center">Loading...</div>;
  
  // #10: Theme-consistent colors
  const bg = darkMode ? 'bg-gray-900' : 'bg-white';
  const bgAlt = darkMode ? 'bg-gray-800' : 'bg-gray-50';
  const text = darkMode ? 'text-gray-100' : 'text-gray-900';
  const textMuted = darkMode ? 'text-gray-400' : 'text-gray-500';
  const border = darkMode ? 'border-gray-700' : 'border-gray-200';
  const headerBg = darkMode ? 'bg-gray-800' : 'bg-slate-600';
  const btnPrimary = darkMode ? 'bg-blue-600 hover:bg-blue-500' : 'bg-slate-700 hover:bg-slate-800';
  
  const globalStyles = `
    input[type="number"]::-webkit-inner-spin-button,
    input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
    input[type="number"] { -moz-appearance: textfield; }
    .tabular-nums { font-variant-numeric: tabular-nums; }
    
    /* Interaction states - design-principles compliance */
    button, [role="button"] {
      transition: all 150ms cubic-bezier(0.25, 1, 0.5, 1);
    }
    button:active:not(:disabled), [role="button"]:active:not(:disabled) {
      transform: scale(0.98);
    }
    button:focus-visible, [role="button"]:focus-visible {
      outline: none;
      box-shadow: 0 0 0 2px ${darkMode ? 'rgba(96, 165, 250, 0.5)' : 'rgba(59, 130, 246, 0.5)'};
    }
    
    /* Collapsible triggers */
    .collapse-trigger {
      transition: color 150ms cubic-bezier(0.25, 1, 0.5, 1);
    }
    
    /* Modal backdrop fade */
    .modal-backdrop {
      animation: fadeIn 200ms cubic-bezier(0.25, 1, 0.5, 1);
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    /* Card hover lift */
    .interactive-card {
      transition: transform 150ms cubic-bezier(0.25, 1, 0.5, 1), 
                  box-shadow 150ms cubic-bezier(0.25, 1, 0.5, 1);
    }
    .interactive-card:hover {
      transform: translateY(-1px);
    }
  `;
  
  return (
    <div className={`min-h-screen ${bg} ${text}`}>
      <style>{globalStyles}</style>
      <div className="max-w-2xl mx-auto p-2 sm:p-4">
        
        {/* #10: Theme-consistent header */}
        <div className={`${headerBg} text-white p-4 rounded-t-lg`}>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-lg font-bold">🌊 Hot Tub</h1>
              <div className="text-slate-300 text-xs flex items-center gap-2">
                <span>335 gal • Salt System</span>
                {!isOnline && <span className="px-1.5 py-0.5 bg-red-600 rounded text-xs">Offline</span>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="min-h-[44px] min-w-[44px] p-2 rounded hover:bg-white/10"
                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
          
          <div className="flex gap-1 mt-3">
            {[
              { id: 'status', label: 'Status' },
              { id: 'history', label: 'History' },
              { id: 'settings', label: '⚙️' },
            ].map(v => (
              <button
                key={v.id}
                onClick={() => setView(v.id)}
                className={`min-h-[44px] px-4 py-2 rounded text-sm font-medium ${
                  view === v.id 
                    ? 'bg-white text-slate-800' 
                    : 'text-slate-200 hover:bg-white/10'
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>
        
        {saveError && (
          <div className="bg-red-600 text-white p-3 flex justify-between items-center">
            <span className="text-sm">⚠️ {saveError}</span>
            <button onClick={() => setSaveError(null)} className="text-lg">&times;</button>
          </div>
        )}
        
        <div className={`${bg} border border-t-0 ${border} rounded-b-lg p-3 sm:p-4`}>
          
          {/* STATUS VIEW */}
          {view === 'status' && (
            <div className="space-y-4">
              
              {/* Readings Grid - #5: Mobile responsive */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Readings</span>
                  <button
                    onClick={() => setShowEntry(!showEntry)}
                    className={`collapse-trigger text-xs px-2 py-1 rounded ${darkMode ? 'text-blue-400 hover:text-blue-300 hover:bg-gray-800' : 'text-blue-600 hover:text-blue-700 hover:bg-gray-100'}`}
                  >
                    {showEntry ? '▲ Close' : '▼ Log New'}
                  </button>
                </div>
                
                {showEntry && (
                  <div className="mb-4">
                    <ReadingEntryForm onSave={handleSaveReading} darkMode={darkMode} />
                  </div>
                )}
                
                {/* #5: grid-cols-2 base for mobile */}
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2">
                  {PARAM_GROUPS.primary.map(param => (
                    <ReadingCard
                      key={param}
                      param={param}
                      value={param === 'cc' ? calculatedCC : latestReading?.[param]}
                      lastTested={param === 'cc' ? null : getLastTested(param)}
                      darkMode={darkMode}
                      isStale={param !== 'cc' && isStale(param)}
                      isDerived={param === 'cc'}
                      projectedValue={projectedReadings[param]}
                    />
                  ))}
                  {PARAM_GROUPS.stability.map(param => (
                    <ReadingCard
                      key={param}
                      param={param}
                      value={param === 'cya' ? (latestReading?.cya || estimatedCYA) : latestReading?.[param]}
                      lastTested={param === 'cya' ? null : getLastTested(param)}
                      darkMode={darkMode}
                      isStale={param !== 'cya' && isStale(param)}
                      isEstimate={param === 'cya' && !latestReading?.cya}
                      projectedValue={param === 'cya' && projectedReadings.cya ? estimatedCYA : projectedReadings[param]}
                    />
                  ))}
                  {PARAM_GROUPS.environmental.map(param => (
                    <ReadingCard
                      key={param}
                      param={param}
                      value={latestReading?.[param]}
                      lastTested={getLastTested(param)}
                      darkMode={darkMode}
                      isStale={isStale(param)}
                    />
                  ))}
                </div>
              </div>
              
              {/* Aeration */}
              <AerationPanel
                aerationState={aerationState}
                aerationStartTime={aerationStartTime}
                aerationStartPh={aerationStartPh}
                latestReading={latestReading}
                events={events}
                onStart={handleStartAeration}
                onStop={handleStopAeration}
                darkMode={darkMode}
              />
              
              {/* Recommendations - #2: Show pending state */}
              <div>
                <div className="text-sm font-medium mb-2">Recommendations</div>
                {recommendations.length === 0 && !hasPendingTreatment ? (
                  <div className={`p-3 rounded border ${border} ${bgAlt} text-center`} role="status" aria-live="polite">
                    <span className="text-green-600">✓ All parameters in range</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {hasPendingTreatment && (
                      <div className={`p-3 rounded border ${darkMode ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 border-blue-200'}`}>
                        <div className="text-sm font-medium">⏳ Treatment logged</div>
                        <div className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                          Retest to verify results and clear this status
                        </div>
                      </div>
                    )}
                    {recommendations.filter(r => r.type !== 'info').map((rec, i) => (
                      <RecommendationCard
                        key={i}
                        rec={rec}
                        onDidIt={() => setTreatmentModal(rec)}
                        darkMode={darkMode}
                        isPending={false}
                      />
                    ))}
                    {recommendations.filter(r => r.type === 'info').map((rec, i) => (
                      <div key={`info-${i}`} className={`p-2 rounded border ${border} ${bgAlt} text-xs ${textMuted}`}>
                        ℹ️ {rec.reason}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* #1/12: Maintenance with action buttons */}
              <MaintenancePanel
                meta={meta}
                estimatedCYA={estimatedCYA}
                onDrainFill={handleDrainFill}
                onCartridgeReplace={handleCartridgeReplace}
                darkMode={darkMode}
              />
              
            </div>
          )}
          
          {/* #13/14: UNIFIED HISTORY VIEW with pagination (v3.10) */}
          {view === 'history' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">History</span>
                <span className={`text-xs ${textMuted}`}>
                  Showing {Math.min(historyLimit, unifiedHistory.length)} of {unifiedHistory.length}
                </span>
              </div>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {unifiedHistory.slice(0, historyLimit).map((entry, i) => (
                  <HistoryEntry key={i} entry={entry} darkMode={darkMode} />
                ))}
                {unifiedHistory.length === 0 && (
                  <div className={textMuted}>No history yet. Log your first test.</div>
                )}
                {unifiedHistory.length > historyLimit && (
                  <button
                    onClick={() => setHistoryLimit(prev => prev + 25)}
                    className={`w-full min-h-[44px] px-4 py-2 rounded font-medium border ${border} ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                    aria-label={`Load 25 more entries (${unifiedHistory.length - historyLimit} remaining)`}
                  >
                    Load more ({unifiedHistory.length - historyLimit} remaining)
                  </button>
                )}
              </div>
            </div>
          )}
          
          {/* SETTINGS VIEW */}
          {view === 'settings' && (
            <div className="space-y-4">
              <div className="text-sm font-medium">Maintenance Dates</div>
              <div className={`p-3 rounded border ${border} ${bgAlt} space-y-3`}>
                <div>
                  <label className={`block text-xs ${textMuted} mb-1`}>Last Drain</label>
                  <input
                    type="date"
                    value={meta.lastDrain || ''}
                    onChange={e => updateMeta({ lastDrain: e.target.value })}
                    className={`w-full p-2 rounded border ${border} ${bg} min-h-[44px]`}
                  />
                </div>
                <div>
                  <label className={`block text-xs ${textMuted} mb-1`}>Cartridge Installed</label>
                  <input
                    type="date"
                    value={meta.cartridgeInstall || ''}
                    onChange={e => updateMeta({ cartridgeInstall: e.target.value })}
                    className={`w-full p-2 rounded border ${border} ${bg} min-h-[44px]`}
                  />
                </div>
              </div>
              
              {/* #18: Feedback on export/clear */}
              <div className="text-sm font-medium">Backup & Reset</div>
              <div className={`p-3 rounded border ${border} ${bgAlt} space-y-2`}>
                <div className={`text-xs ${textMuted}`}>Export</div>
                <div className="flex gap-2">
                  <button onClick={exportData} className={`flex-1 min-h-[44px] px-4 py-2 rounded font-medium border ${border}`}>
                    📥 Download
                  </button>
                  <button onClick={copyToClipboard} className={`flex-1 min-h-[44px] px-4 py-2 rounded font-medium border ${border}`}>
                    📋 Copy
                  </button>
                </div>
                {exportStatus && (
                  <div className={`text-xs p-2 rounded ${exportStatus.startsWith('✓') ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                    {exportStatus}
                  </div>
                )}
                
                <div className={`text-xs ${textMuted} pt-2`}>Import</div>
                <div className="flex gap-2">
                  <label className={`flex-1 min-h-[44px] px-4 py-2 rounded font-medium border ${border} text-center cursor-pointer flex items-center justify-center`}>
                    📁 File
                    <input type="file" accept=".json" onChange={importData} className="hidden" />
                  </label>
                  <button onClick={pasteFromClipboard} className={`flex-1 min-h-[44px] px-4 py-2 rounded font-medium border ${border}`}>
                    📋 Paste
                  </button>
                </div>
                {importStatus && (
                  <div className={`text-xs p-2 rounded ${importStatus.startsWith('✓') ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                    {importStatus}
                  </div>
                )}
                
                <div className="pt-2">
                  <button onClick={() => setShowClearModal(true)} className="w-full min-h-[44px] px-4 py-2 rounded font-medium bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2">
                    Clear All Data {clearStatus && <span>{clearStatus}</span>}
                  </button>
                </div>
              </div>
              
              <div className={`text-xs ${textMuted}`}>
                Readings: {readings.length} • Treatments: {treatments.length} • Events: {events.length}
              </div>
            </div>
          )}
          
        </div>
        
        {treatmentModal && (
          <TreatmentModal
            rec={treatmentModal}
            onSave={handleSaveTreatment}
            onCancel={() => setTreatmentModal(null)}
            darkMode={darkMode}
          />
        )}
        
        {/* Clear Data Confirmation Modal */}
        {showClearModal && (
          <div className="modal-backdrop fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={(e) => { if (e.target === e.currentTarget) setShowClearModal(false); }} role="dialog" aria-modal="true" aria-labelledby="clear-modal-title">
            <div ref={clearModalRef} className={`${bg} rounded-lg p-4 max-w-sm w-full border ${border}`} onClick={(e) => e.stopPropagation()}>
              <h3 id="clear-modal-title" className="text-lg font-semibold mb-2 text-red-600">⚠️ Delete All Data?</h3>
              <p className={`text-sm mb-4 ${textMuted}`}>
                This will permanently delete all readings, treatments, and events. Export a backup first if needed.
              </p>
              <div className={`text-xs mb-4 ${textMuted}`}>
                {readings.length} readings • {treatments.length} treatments • {events.length} events
              </div>
              <div className="flex gap-2">
                <button
                  onClick={clearAllData}
                  className="flex-1 min-h-[44px] px-4 py-2 rounded font-medium bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete Everything
                </button>
                <button
                  onClick={() => setShowClearModal(false)}
                  className={`min-h-[44px] px-4 py-2 rounded font-medium border ${border}`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* #15: Single footer, removed redundant header mention */}
        <div className={`mt-2 text-xs ${textMuted} text-center`}>
          Hotspring Flair • 335 gal • FreshWater Salt • v3.10
        </div>
      </div>
    </div>
  );
}
