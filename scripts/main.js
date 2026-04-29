/* main.js — navigation, progress tracking, quiz engine, copy buttons */

const LESSONS = [
  { id: 'intro',          phase: 1, title: 'Introduction to C',       path: 'pages/phase1/intro.html' },
  { id: 'setup',          phase: 1, title: 'Setup & Toolchain',        path: 'pages/phase1/setup.html' },
  { id: 'hello-world',    phase: 1, title: 'Hello, World!',            path: 'pages/phase1/hello-world.html' },
  { id: 'syntax',         phase: 1, title: 'Syntax & Data Types',      path: 'pages/phase1/syntax.html' },
  { id: 'control-flow',   phase: 1, title: 'Control Flow',             path: 'pages/phase1/control-flow.html' },
  { id: 'functions',      phase: 1, title: 'Functions',                path: 'pages/phase1/functions.html' },
  { id: 'arrays-strings', phase: 2, title: 'Arrays & Strings',         path: 'pages/phase2/arrays-strings.html' },
  { id: 'pointers',       phase: 2, title: 'Pointers',                 path: 'pages/phase2/pointers.html' },
  { id: 'structures',     phase: 2, title: 'Structures',               path: 'pages/phase2/structures.html' },
  { id: 'file-io',        phase: 2, title: 'File I/O',                 path: 'pages/phase2/file-io.html' },
  { id: 'memory-management',      phase: 3, title: 'Memory Management',        path: 'pages/phase3/memory-management.html' },
  { id: 'dynamic-data-structures',phase: 3, title: 'Dynamic Data Structures',  path: 'pages/phase3/dynamic-data-structures.html' },
  { id: 'recursion',              phase: 3, title: 'Recursion',                path: 'pages/phase3/recursion.html' },
  { id: 'error-handling',         phase: 3, title: 'Error Handling',           path: 'pages/phase3/error-handling.html' },
  { id: 'project-calculator',     phase: 4, title: 'Project: Calculator',      path: 'pages/phase4/project-calculator.html' },
  { id: 'project-student-records',phase: 4, title: 'Project: Student Records', path: 'pages/phase4/project-student-records.html' },
  { id: 'project-file-management',phase: 4, title: 'Project: File Management', path: 'pages/phase4/project-file-management.html' },
  { id: 'project-mini-shell',     phase: 4, title: 'Project: Mini Shell',      path: 'pages/phase4/project-mini-shell.html' },
];

const PHASE_NAMES = { 1: 'Phase 1 — Fundamentals', 2: 'Phase 2 — Deeper Concepts', 3: 'Phase 3 — Advanced', 4: 'Phase 4 — Projects' };

/* ─── Progress Storage ─── */
function getProgress() {
  try { return JSON.parse(localStorage.getItem('c_progress') || '{}'); } catch { return {}; }
}
function setProgress(p) { localStorage.setItem('c_progress', JSON.stringify(p)); }
function markLessonComplete(id) {
  const p = getProgress();
  if (!p[id]) {
    p[id] = { completedAt: Date.now() };
    setProgress(p);
    window.dispatchEvent(new CustomEvent('lessonCompleted', { detail: { id } }));
  }
}
function isComplete(id) { return !!getProgress()[id]; }
function completedCount() { return Object.keys(getProgress()).length; }
function phaseCompleted(n) { return LESSONS.filter(l => l.phase === n).every(l => isComplete(l.id)); }

/* ─── Sidebar Builder ─── */
function buildSidebar() {
  const nav = document.getElementById('main-nav');
  if (!nav) return;
  nav.innerHTML = '';

  const phases = [1, 2, 3, 4];
  phases.forEach(phase => {
    const lessons = LESSONS.filter(l => l.phase === phase);
    const div = document.createElement('div');
    div.className = 'nav-phase';

    const toggle = document.createElement('button');
    toggle.className = 'nav-phase-toggle';
    toggle.innerHTML = `${PHASE_NAMES[phase]} <span class="arrow">▼</span>`;
    toggle.onclick = () => {
      toggle.classList.toggle('collapsed');
      ul.classList.toggle('collapsed');
    };

    const ul = document.createElement('ul');
    ul.className = 'nav-phase-lessons';
    lessons.forEach(l => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      const depth = location.pathname.includes('/pages/') ? '../../' : '';
      a.href = depth + l.path;
      a.textContent = l.title;
      if (isComplete(l.id)) a.classList.add('completed');
      const current = getCurrentLessonId();
      if (current === l.id) a.classList.add('active');
      li.appendChild(a);
      ul.appendChild(li);
    });

    div.appendChild(toggle);
    div.appendChild(ul);
    nav.appendChild(div);
  });

  // Tools section
  const divider = document.createElement('div');
  divider.className = 'nav-divider';
  nav.appendChild(divider);
  const toolsHeader = document.createElement('div');
  toolsHeader.className = 'nav-tools-header';
  toolsHeader.textContent = 'Tools';
  nav.appendChild(toolsHeader);
  const toolsUl = document.createElement('ul');
  toolsUl.className = 'nav-tools-lessons';
  const depth = location.pathname.includes('/pages/') ? '../../' :
                location.pathname.includes('/tools/') ? '../' :
                location.pathname.includes('/reference/') ? '../' : '';
  [
    { href: depth + 'tools/error-decoder.html', text: '⚙ Error Decoder' },
    { href: depth + 'reference/glossary.html',  text: '📖 Glossary' },
  ].forEach(item => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = item.href;
    a.textContent = item.text;
    li.appendChild(a);
    toolsUl.appendChild(li);
  });
  nav.appendChild(toolsUl);

  updateProgressBar();
  updateStreakDisplay();
}

function updateProgressBar() {
  const fill = document.getElementById('progress-bar-fill');
  const label = document.getElementById('progress-bar-label');
  if (!fill || !label) return;
  const done = completedCount();
  const total = LESSONS.length;
  const pct = Math.round((done / total) * 100);
  fill.style.width = pct + '%';
  const spans = label.querySelectorAll('span');
  if (spans.length === 2) {
    spans[0].textContent = `Progress`;
    spans[1].textContent = `${done}/${total}`;
  }
}

function updateStreakDisplay() {
  const el = document.querySelector('.streak-display');
  if (!el) return;
  const streak = window.getStreak ? window.getStreak() : 0;
  el.textContent = streak > 0 ? `🔥 ${streak} day streak` : '⚡ Start your streak today';
}

/* ─── Get current lesson ID from URL ─── */
function getCurrentLessonId() {
  const path = location.pathname;
  for (const l of LESSONS) {
    if (path.endsWith(l.id + '.html')) return l.id;
  }
  return null;
}

function getAdjacentLessons(id) {
  const idx = LESSONS.findIndex(l => l.id === id);
  const depth = location.pathname.includes('/pages/') ? '../../' : '';
  return {
    prev: idx > 0 ? depth + LESSONS[idx - 1].path : null,
    prevTitle: idx > 0 ? LESSONS[idx - 1].title : null,
    next: idx < LESSONS.length - 1 ? depth + LESSONS[idx + 1].path : null,
    nextTitle: idx < LESSONS.length - 1 ? LESSONS[idx + 1].title : null,
  };
}

/* ─── Keyboard Navigation ─── */
function initKeyboardNav() {
  const id = getCurrentLessonId();
  if (!id) return;
  const { prev, next } = getAdjacentLessons(id);
  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'ArrowRight' && next) location.href = next;
    if (e.key === 'ArrowLeft' && prev) location.href = prev;
  });
}

/* ─── Render Lesson Nav Buttons ─── */
function renderLessonNav(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const id = getCurrentLessonId();
  if (!id) return;
  const { prev, prevTitle, next, nextTitle } = getAdjacentLessons(id);
  container.innerHTML = '';
  if (prev) {
    const a = document.createElement('a');
    a.href = prev;
    a.className = 'btn-nav';
    a.innerHTML = `← ${prevTitle}`;
    container.appendChild(a);
  } else {
    container.appendChild(document.createElement('span'));
  }
  if (next) {
    const a = document.createElement('a');
    a.href = next;
    a.className = 'btn-nav primary';
    a.innerHTML = `${nextTitle} →`;
    container.appendChild(a);
  }
}

/* ─── Right Panel ─── */
function updateRightPanel() {
  const id = getCurrentLessonId();
  if (!id) return;
  const lesson = LESSONS.find(l => l.id === id);
  if (!lesson) return;
  const phaseEl = document.getElementById('panel-phase');
  const statusEl = document.getElementById('panel-status');
  if (phaseEl) phaseEl.textContent = PHASE_NAMES[lesson.phase];
  if (statusEl) statusEl.textContent = isComplete(id) ? '✓ Complete' : 'In Progress';
  if (statusEl) statusEl.style.color = isComplete(id) ? 'var(--accent)' : 'var(--text-dim)';
}

/* ─── Quiz Engine ─── */
function initQuiz(quizId, questions) {
  const container = document.getElementById(quizId);
  if (!container) return;

  const submitBtn = document.getElementById('quiz-submit');
  const resultEl = document.getElementById('quiz-result');
  const markAnyway = document.getElementById('mark-complete-anyway');

  let answered = {};

  container.querySelectorAll('.quiz-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const qIdx = btn.dataset.q;
      if (answered[qIdx] !== undefined) return;
      container.querySelectorAll(`[data-q="${qIdx}"]`).forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      answered[qIdx] = parseInt(btn.dataset.opt);
    });
  });

  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      if (Object.keys(answered).length < questions.length) {
        resultEl.style.display = 'block';
        resultEl.className = 'partial';
        resultEl.textContent = 'Please answer all questions before submitting.';
        return;
      }

      let correct = 0;
      questions.forEach((q, idx) => {
        const selected = answered[idx];
        const isCorrect = selected === q.correct;
        if (isCorrect) correct++;

        container.querySelectorAll(`[data-q="${idx}"]`).forEach(btn => {
          btn.disabled = true;
          const opt = parseInt(btn.dataset.opt);
          if (opt === q.correct) btn.classList.add('correct');
          else if (opt === selected && !isCorrect) btn.classList.add('incorrect');
        });

        const expEl = document.getElementById(`explanation-${idx}`);
        if (expEl) expEl.classList.add('visible');

        if (window.srRecordAnswer) {
          window.srRecordAnswer(q.id, isCorrect);
        }
      });

      submitBtn.style.display = 'none';
      resultEl.style.display = 'block';

      const lessonId = getCurrentLessonId();
      if (correct === questions.length) {
        resultEl.className = 'pass';
        resultEl.textContent = 'Excellent — lesson marked complete ✓';
        if (lessonId) markLessonComplete(lessonId);
        buildSidebar();
      } else if (correct >= Math.floor(questions.length * 0.67)) {
        resultEl.className = 'partial';
        resultEl.textContent = `Good — ${correct}/${questions.length} correct — lesson marked complete ✓ — review the missed concept before moving on.`;
        if (lessonId) markLessonComplete(lessonId);
        buildSidebar();
      } else {
        resultEl.className = 'fail';
        resultEl.textContent = `${correct}/${questions.length} correct — We recommend revisiting this lesson before continuing.`;
        if (markAnyway) markAnyway.style.display = 'inline-block';
      }

      if (window.recordActivity) window.recordActivity();
    });
  }

  if (markAnyway) {
    markAnyway.addEventListener('click', () => {
      const lessonId = getCurrentLessonId();
      if (lessonId) markLessonComplete(lessonId);
      markAnyway.style.display = 'none';
      resultEl.textContent += ' (marked complete)';
      buildSidebar();
    });
  }
}

/* ─── Copy Buttons on Code Blocks ─── */
function initCopyButtons() {
  document.querySelectorAll('pre').forEach(pre => {
    if (pre.querySelector('.copy-btn')) return;
    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.textContent = 'copy';
    btn.addEventListener('click', () => {
      const code = pre.querySelector('code');
      navigator.clipboard.writeText(code ? code.textContent : pre.textContent).then(() => {
        btn.textContent = 'copied!';
        setTimeout(() => { btn.textContent = 'copy'; }, 1800);
      });
    });
    pre.appendChild(btn);
  });
}

/* ─── Hint Toggles ─── */
function initHintToggles() {
  document.querySelectorAll('.hint-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const target = toggle.nextElementSibling;
      if (!target) return;
      target.classList.toggle('visible');
      toggle.textContent = target.classList.contains('visible') ? 'Hide hint' : 'Show hint';
    });
  });
}

/* ─── Tab System ─── */
function initTabs() {
  document.querySelectorAll('.tab-container').forEach(container => {
    const buttons = container.querySelectorAll('.tab-btn');
    const panels = container.querySelectorAll('.tab-panel');
    buttons.forEach((btn, i) => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        if (panels[i]) panels[i].classList.add('active');
      });
    });
  });
}

/* ─── Reveal Toggles ─── */
function initRevealToggles() {
  document.querySelectorAll('.reveal-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const content = toggle.nextElementSibling;
      if (!content) return;
      toggle.classList.toggle('open');
      content.classList.toggle('open');
      toggle.textContent = content.classList.contains('open')
        ? toggle.textContent.replace('▶ Reveal', '▼ Hide')
        : toggle.textContent.replace('▼ Hide', '▶ Reveal');
    });
  });
}

/* ─── Hamburger ─── */
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (!hamburger || !sidebar) return;

  hamburger.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    if (overlay) overlay.classList.toggle('open');
  });
  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('open');
    });
  }
}

/* ─── Scroll to Top ─── */
function initScrollTop() {
  const btn = document.getElementById('scroll-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 300);
  });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ─── Lesson Completion Badge in meta ─── */
function updateLessonMeta() {
  const id = getCurrentLessonId();
  if (!id || !isComplete(id)) return;
  const meta = document.querySelector('.lesson-meta');
  if (!meta) return;
  if (!meta.querySelector('.meta-badge.complete')) {
    const badge = document.createElement('span');
    badge.className = 'meta-badge complete';
    badge.textContent = '✓ Completed';
    meta.appendChild(badge);
  }
}

/* ─── Init ─── */
document.addEventListener('DOMContentLoaded', () => {
  buildSidebar();
  initHamburger();
  initCopyButtons();
  initHintToggles();
  initTabs();
  initRevealToggles();
  initKeyboardNav();
  initScrollTop();
  updateRightPanel();
  updateLessonMeta();
  renderLessonNav('lesson-nav');
});

window.addEventListener('lessonCompleted', () => {
  buildSidebar();
  updateRightPanel();
  updateLessonMeta();
  if (window.checkBadges) window.checkBadges();
});

/* Expose helpers for other scripts */
window.LESSONS = LESSONS;
window.isComplete = isComplete;
window.markLessonComplete = markLessonComplete;
window.completedCount = completedCount;
window.phaseCompleted = phaseCompleted;
window.initQuiz = initQuiz;
window.getCurrentLessonId = getCurrentLessonId;
