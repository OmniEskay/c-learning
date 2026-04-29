/* streaks.js — daily streak tracking and badge system */

const STREAK_KEY   = 'c_streak';
const ACTIVITY_KEY = 'c_activity';
const BADGES_KEY   = 'c_badges';

const BADGE_DEFS = [
  { id: 'first-steps',  icon: '🥉', label: 'First Steps',      desc: 'Complete your first lesson' },
  { id: 'phase1',       icon: '📘', label: 'Phase 1 Complete',  desc: 'Complete all Phase 1 lessons' },
  { id: 'phase2',       icon: '📗', label: 'Phase 2 Complete',  desc: 'Complete all Phase 2 lessons' },
  { id: 'phase3',       icon: '📕', label: 'Phase 3 Complete',  desc: 'Complete all Phase 3 lessons' },
  { id: 'c-programmer', icon: '🏆', label: 'C Programmer',      desc: 'Complete all 4 phases' },
  { id: 'on-fire',      icon: '🔥', label: 'On Fire',           desc: '7-day streak' },
  { id: 'dedicated',    icon: '💎', label: 'Dedicated',         desc: '30-day streak' },
];

function getEarnedBadges() {
  try { return JSON.parse(localStorage.getItem(BADGES_KEY) || '[]'); } catch { return []; }
}
function saveEarnedBadges(arr) { localStorage.setItem(BADGES_KEY, JSON.stringify(arr)); }

function getActivityLog() {
  try { return JSON.parse(localStorage.getItem(ACTIVITY_KEY) || '[]'); } catch { return []; }
}
function saveActivityLog(arr) { localStorage.setItem(ACTIVITY_KEY, JSON.stringify(arr)); }

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

/* Record activity for today */
window.recordActivity = function() {
  const today = todayStr();
  const log = getActivityLog();
  if (!log.includes(today)) {
    log.push(today);
    saveActivityLog(log);
  }
  updateStreak();
  if (window.checkBadges) window.checkBadges();
};

/* Calculate streak from activity log */
function calcStreak(log) {
  if (!log.length) return 0;
  const sorted = [...new Set(log)].sort().reverse();
  const today = todayStr();
  const yesterday = offsetDay(today, -1);

  if (sorted[0] !== today && sorted[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === offsetDay(sorted[i-1], -1)) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

function offsetDay(dateStr, days) {
  const d = new Date(dateStr + 'T12:00:00');
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function updateStreak() {
  const log = getActivityLog();
  const streak = calcStreak(log);
  localStorage.setItem(STREAK_KEY, streak);
  const el = document.querySelector('.streak-display');
  if (el) el.textContent = streak > 0 ? `🔥 ${streak} day streak` : '⚡ Start your streak today';
  const dashEl = document.getElementById('streak-count');
  if (dashEl) dashEl.textContent = streak;
  return streak;
}

window.getStreak = function() {
  return calcStreak(getActivityLog());
};

/* ─── Badge Checking ─── */
window.checkBadges = function() {
  const earned = new Set(getEarnedBadges());
  const newBadges = [];

  if (window.completedCount && window.completedCount() >= 1 && !earned.has('first-steps')) {
    earned.add('first-steps');
    newBadges.push('first-steps');
  }
  if (window.phaseCompleted) {
    [1,2,3].forEach(p => {
      const id = `phase${p}`;
      if (window.phaseCompleted(p) && !earned.has(id)) {
        earned.add(id);
        newBadges.push(id);
      }
    });
    if (window.phaseCompleted(4) && !earned.has('c-programmer')) {
      earned.add('c-programmer');
      newBadges.push('c-programmer');
    }
  }
  const streak = window.getStreak ? window.getStreak() : 0;
  if (streak >= 7 && !earned.has('on-fire')) { earned.add('on-fire'); newBadges.push('on-fire'); }
  if (streak >= 30 && !earned.has('dedicated')) { earned.add('dedicated'); newBadges.push('dedicated'); }

  if (newBadges.length) {
    saveEarnedBadges([...earned]);
    renderBadges(newBadges);
  } else {
    renderBadges([]);
  }
};

function renderBadges(newlyEarned) {
  const container = document.getElementById('badges-container');
  if (!container) return;
  const earned = getEarnedBadges();
  container.innerHTML = '';
  BADGE_DEFS.forEach(def => {
    const span = document.createElement('span');
    span.className = 'badge' + (earned.includes(def.id) ? ' earned' : '');
    span.title = def.desc;
    span.textContent = `${def.icon} ${def.label}`;
    if (newlyEarned.includes(def.id)) span.style.animationDelay = '0s';
    container.appendChild(span);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  updateStreak();
  if (window.checkBadges) window.checkBadges();
  renderBadges([]);
});

window.BADGE_DEFS = BADGE_DEFS;
window.getEarnedBadges = getEarnedBadges;
