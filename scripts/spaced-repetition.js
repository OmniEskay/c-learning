/* spaced-repetition.js — SM-2 based review scheduling */

const SR_KEY = 'sr_data';

/* All quiz questions from all lessons, keyed by unique ID */
const ALL_QUESTIONS = [
  /* Phase 1 — intro */
  { id: 'q_intro_1', lesson: 'intro', q: 'What year was C first standardized by ANSI?', opts: ['1978','1983','1989','1999'], correct: 2, exp: 'ANSI C (C89) was standardized in 1989, giving portability across compilers.' },
  { id: 'q_intro_2', lesson: 'intro', q: 'Which of the following is NOT a direct use of C?', opts: ['Linux kernel','Android runtime (Dalvik/ART)','PostgreSQL internals','Java bytecode compilation'], correct: 3, exp: 'Java bytecode is compiled by the JVM, which itself may be written in C, but the bytecode compilation is a Java concept.' },
  { id: 'q_intro_3', lesson: 'intro', q: 'C is classified as a:', opts: ['High-level scripting language','Low-level assembly language','Mid-level compiled language','Interpreted bytecode language'], correct: 2, exp: 'C is often called mid-level — it has high-level constructs but allows direct memory manipulation.' },

  /* Phase 1 — setup */
  { id: 'q_setup_1', lesson: 'setup', q: 'Which flag enables all common warnings in GCC?', opts: ['-w','-Wall','-Warn','-W'], correct: 1, exp: '-Wall enables a broad set of warnings that catch most common bugs.' },
  { id: 'q_setup_2', lesson: 'setup', q: 'What does the -o flag do in `gcc main.c -o program`?', opts: ['Enables optimisation','Names the output binary','Opens a file','Sets object file mode'], correct: 1, exp: '-o specifies the output file name for the compiled binary.' },
  { id: 'q_setup_3', lesson: 'setup', q: 'What stage converts .c source to a .o object file?', opts: ['Linking','Preprocessing','Compilation','Execution'], correct: 2, exp: 'Compilation translates C source to machine-code object files. Linking combines them into an executable.' },

  /* Phase 1 — hello-world */
  { id: 'q_hw_1', lesson: 'hello-world', q: 'What does `return 0;` at the end of main() signal?', opts: ['A compile error','Successful program termination','Memory freed','The program loops'], correct: 1, exp: 'By convention, returning 0 from main() tells the OS the program exited successfully.' },
  { id: 'q_hw_2', lesson: 'hello-world', q: 'What header must you include to use printf?', opts: ['<string.h>','<stdlib.h>','<stdio.h>','<math.h>'], correct: 2, exp: 'printf is declared in <stdio.h> (standard input/output).' },
  { id: 'q_hw_3', lesson: 'hello-world', q: 'What does `\\n` inside a string literal do?', opts: ['Escapes a backslash','Inserts a tab','Inserts a newline','Terminates the string'], correct: 2, exp: '\\n is the escape sequence for a newline character (ASCII 10).' },

  /* Phase 1 — syntax */
  { id: 'q_syntax_1', lesson: 'syntax', q: 'Which format specifier prints a float with printf?', opts: ['%d','%i','%f','%s'], correct: 2, exp: '%f is used for float and double in printf. %d is for integers.' },
  { id: 'q_syntax_2', lesson: 'syntax', q: 'What is the result of 7 % 3 in C?', opts: ['2','1','3','0'], correct: 1, exp: '% is the modulo operator. 7 divided by 3 is 2 remainder 1.' },
  { id: 'q_syntax_3', lesson: 'syntax', q: 'Which declaration creates a constant integer?', opts: ['int const = 5;','const int x = 5;','#define int x 5','static int x = 5;'], correct: 1, exp: 'const int x = 5; declares a constant that cannot be reassigned.' },

  /* Phase 1 — control-flow */
  { id: 'q_cf_1', lesson: 'control-flow', q: 'Which loop always executes its body at least once?', opts: ['for','while','do-while','All of the above'], correct: 2, exp: 'do-while checks its condition after the body, so the body always runs at least once.' },
  { id: 'q_cf_2', lesson: 'control-flow', q: 'What keyword exits a loop immediately?', opts: ['exit','continue','break','return'], correct: 2, exp: 'break exits the innermost loop or switch statement immediately.' },
  { id: 'q_cf_3', lesson: 'control-flow', q: 'A `switch` statement requires what at the end of each case to prevent fall-through?', opts: ['return','exit','stop','break'], correct: 3, exp: 'Without break, execution falls through to the next case. break prevents this.' },

  /* Phase 1 — functions */
  { id: 'q_fn_1', lesson: 'functions', q: 'What is a function prototype?', opts: ['The function body','A forward declaration of the function signature','A macro definition','A typedef'], correct: 1, exp: 'A prototype declares the return type and parameter types so the compiler knows how to call the function before seeing its definition.' },
  { id: 'q_fn_2', lesson: 'functions', q: 'Variables declared inside a function have what scope?', opts: ['Global','Static','Local (block)','External'], correct: 2, exp: 'Local variables exist only within their enclosing block and are destroyed when the block exits.' },
  { id: 'q_fn_3', lesson: 'functions', q: 'What does `void` as a return type indicate?', opts: ['The function returns 0','The function returns a pointer','The function returns nothing','A compile error'], correct: 2, exp: 'void means the function does not return a value.' },

  /* Phase 2 — arrays-strings */
  { id: 'q_arr_1', lesson: 'arrays-strings', q: 'How is a C string terminated?', opts: ["A '\\\\0' null character","A newline '\\\\n'","A space character","A semicolon"], correct: 0, exp: 'C strings are null-terminated: a \\0 byte signals the end of the string.' },
  { id: 'q_arr_2', lesson: 'arrays-strings', q: 'What is the index of the first element of an array in C?', opts: ['1','0','-1','Depends on the type'], correct: 1, exp: 'C arrays are zero-indexed: the first element is at index 0.' },
  { id: 'q_arr_3', lesson: 'arrays-strings', q: 'Which function copies one string into another?', opts: ['strdup','strmov','strcpy','strset'], correct: 2, exp: 'strcpy(dest, src) copies the string at src into the buffer at dest.' },

  /* Phase 2 — pointers */
  { id: 'q_ptr_1', lesson: 'pointers', q: 'What does the & operator do when applied to a variable?', opts: ['Dereferences a pointer','Returns the address of the variable','Declares a pointer','Performs bitwise AND'], correct: 1, exp: '& is the address-of operator. &x gives the memory address where x is stored.' },
  { id: 'q_ptr_2', lesson: 'pointers', q: 'What does `*ptr` do when ptr is a pointer?', opts: ['Declares ptr as a pointer','Multiplies ptr by itself','Dereferences ptr — reads the value at its address','Frees the memory at ptr'], correct: 2, exp: 'The * dereference operator accesses the value stored at the address held by a pointer.' },
  { id: 'q_ptr_3', lesson: 'pointers', q: 'Which function allocates memory on the heap?', opts: ['alloc','new','malloc','halloc'], correct: 2, exp: 'malloc(n) allocates n bytes on the heap and returns a pointer to the memory.' },

  /* Phase 2 — structures */
  { id: 'q_str_1', lesson: 'structures', q: 'How do you access a field of a struct through a pointer?', opts: ['s.field','s->field','s[field]','*s.field'], correct: 1, exp: 'The -> operator dereferences a struct pointer and accesses a field. p->x is shorthand for (*p).x.' },
  { id: 'q_str_2', lesson: 'structures', q: 'What does typedef do when used with a struct?', opts: ['Allocates memory for the struct','Creates an alias type name','Defines the struct fields','Makes the struct immutable'], correct: 1, exp: 'typedef creates an alias, so you can write Point instead of struct Point.' },
  { id: 'q_str_3', lesson: 'structures', q: 'Structs are passed to functions by:', opts: ['Reference by default','Value by default','Pointer only','The compiler decides'], correct: 1, exp: 'C passes structs by value (the whole struct is copied). Pass a pointer explicitly for efficiency or mutation.' },

  /* Phase 2 — file-io */
  { id: 'q_fio_1', lesson: 'file-io', q: 'What does fopen return if the file cannot be opened?', opts: ['0','-1','NULL','EOF'], correct: 2, exp: 'fopen returns NULL on failure. Always check for NULL before using the returned FILE pointer.' },
  { id: 'q_fio_2', lesson: 'file-io', q: 'Which mode opens a file for writing and truncates it if it exists?', opts: ['"r"','"a"','"w"','"x"'], correct: 2, exp: '"w" opens for writing and truncates (empties) the file. "a" appends instead.' },
  { id: 'q_fio_3', lesson: 'file-io', q: 'What value does fgetc return at end-of-file?', opts: ['0','\\0','NULL','EOF'], correct: 3, exp: 'EOF (typically -1) signals end-of-file or an error from fgetc.' },

  /* Phase 3 — memory-management */
  { id: 'q_mem_1', lesson: 'memory-management', q: 'What is a memory leak?', opts: ['Reading from an invalid pointer','Allocated memory that is never freed','Stack overflow','Writing past an array bound'], correct: 1, exp: 'A memory leak occurs when heap memory is allocated but never freed, growing the process footprint until it is killed.' },
  { id: 'q_mem_2', lesson: 'memory-management', q: 'calloc differs from malloc in that it:', opts: ['Allocates on the stack','Returns a void pointer','Zero-initialises the allocated memory','Accepts a single size argument'], correct: 2, exp: 'calloc(n, size) allocates n*size bytes and zero-initialises them. malloc leaves the memory uninitialised.' },
  { id: 'q_mem_3', lesson: 'memory-management', q: 'What tool detects memory leaks and invalid accesses at runtime?', opts: ['GDB','Valgrind','Lint','nm'], correct: 1, exp: 'Valgrind (memcheck) instruments the program to detect heap errors, leaks, and invalid reads/writes.' },

  /* Phase 3 — dynamic-data-structures */
  { id: 'q_dds_1', lesson: 'dynamic-data-structures', q: 'In a singly linked list, the last node\'s next pointer should be:', opts: ['0','EOF','NULL','A pointer back to head'], correct: 2, exp: 'NULL signals the end of the list. Forgetting to set this causes undefined behaviour when traversing.' },
  { id: 'q_dds_2', lesson: 'dynamic-data-structures', q: 'A stack follows which order?', opts: ['FIFO','LIFO','Random','FILO — same as FIFO'], correct: 1, exp: 'Stacks are Last-In First-Out. The most recently pushed item is the first popped.' },
  { id: 'q_dds_3', lesson: 'dynamic-data-structures', q: 'What is the time complexity of inserting at the head of a singly linked list?', opts: ['O(n)','O(log n)','O(1)','O(n²)'], correct: 2, exp: 'Head insertion is O(1) — you only update the head pointer and the new node\'s next.' },

  /* Phase 3 — recursion */
  { id: 'q_rec_1', lesson: 'recursion', q: 'What is the base case in recursion?', opts: ['The first recursive call','The condition that stops recursion','The return type','The stack frame'], correct: 1, exp: 'The base case is the condition under which the function returns without making another recursive call, terminating the recursion.' },
  { id: 'q_rec_2', lesson: 'recursion', q: 'What happens if a recursive function has no base case?', opts: ['It returns 0','It compiles but prints garbage','Stack overflow (infinite recursion)','It loops silently'], correct: 2, exp: 'Without a base case the function calls itself forever, eventually exhausting the stack and causing a crash.' },
  { id: 'q_rec_3', lesson: 'recursion', q: 'Compared to an iterative solution, recursion typically:', opts: ['Uses less memory','Uses more stack memory per call','Is always faster','Is impossible in C'], correct: 1, exp: 'Each recursive call pushes a new stack frame. Deep recursion can cause stack overflow that a loop would not.' },

  /* Phase 3 — error-handling */
  { id: 'q_err_1', lesson: 'error-handling', q: 'What global variable is set when a system call fails?', opts: ['error','errmsg','errno','strerr'], correct: 2, exp: 'errno is a global integer set by the C library when a system call fails, indicating the type of error.' },
  { id: 'q_err_2', lesson: 'error-handling', q: 'Which function prints a human-readable error message for the current errno?', opts: ['printf_err','strerror','perror','errprint'], correct: 2, exp: 'perror(str) prints str followed by a colon and the error message corresponding to errno.' },
  { id: 'q_err_3', lesson: 'error-handling', q: 'By convention, a C function returns what value to signal failure?', opts: ['1 or a non-NULL pointer','0 or NULL (context-dependent)','A negative number only','The errno value'], correct: 1, exp: 'Convention varies: integer functions return -1/non-zero for failure; pointer functions return NULL. Check the man page.' },
];

/* ─── SR Storage ─── */
function getSRData() {
  try { return JSON.parse(localStorage.getItem(SR_KEY) || '{}'); } catch { return {}; }
}
function saveSRData(d) { localStorage.setItem(SR_KEY, JSON.stringify(d)); }

function getQuestionRecord(id) {
  const data = getSRData();
  return data[id] || { interval: 1, nextReview: Date.now(), easiness: 2.5, streak: 0 };
}

/* SM-2 simplified update */
function updateSR(id, correct) {
  const data = getSRData();
  const rec = data[id] || { interval: 1, nextReview: Date.now(), easiness: 2.5, streak: 0 };
  const MS_DAY = 86400000;
  if (correct) {
    rec.streak = (rec.streak || 0) + 1;
    rec.interval = Math.round(rec.interval * rec.easiness);
    rec.easiness = Math.max(1.3, rec.easiness + 0.1);
  } else {
    rec.streak = 0;
    rec.interval = 1;
    rec.easiness = Math.max(1.3, rec.easiness - 0.2);
  }
  rec.nextReview = Date.now() + rec.interval * MS_DAY;
  data[id] = rec;
  saveSRData(data);
}

function getDueQuestions() {
  const now = Date.now();
  const data = getSRData();
  return ALL_QUESTIONS.filter(q => {
    const rec = data[q.id];
    if (!rec) return false;
    return rec.nextReview <= now;
  });
}

function getDueCount() { return getDueQuestions().length; }

/* ─── Record answer from lesson quiz ─── */
window.srRecordAnswer = function(id, correct) {
  const data = getSRData();
  if (!data[id]) {
    /* First time encountering this question — schedule for review tomorrow */
    data[id] = { interval: 1, nextReview: Date.now() + 86400000, easiness: 2.5, streak: correct ? 1 : 0 };
    saveSRData(data);
  } else {
    updateSR(id, correct);
  }
};

/* ─── Review Modal ─── */
function buildReviewModal() {
  const existing = document.getElementById('sr-modal');
  if (existing) return;

  const modal = document.createElement('div');
  modal.id = 'sr-modal';
  modal.innerHTML = `
    <div id="sr-modal-inner">
      <button id="sr-modal-close">✕</button>
      <div id="sr-progress-text"></div>
      <div id="sr-question-text"></div>
      <ul id="sr-options"></ul>
      <div id="sr-feedback"></div>
      <button id="sr-next">Next →</button>
    </div>`;
  document.body.appendChild(modal);

  document.getElementById('sr-modal-close').addEventListener('click', closeReview);
  modal.addEventListener('click', e => { if (e.target === modal) closeReview(); });
}

let reviewQueue = [];
let reviewIndex = 0;
let reviewAnswered = false;

function openReview() {
  buildReviewModal();
  reviewQueue = getDueQuestions();
  if (reviewQueue.length === 0) {
    alert('No questions due for review right now. Complete more lessons to add questions!');
    return;
  }
  reviewIndex = 0;
  document.getElementById('sr-modal').classList.add('open');
  showReviewQuestion();
}

function closeReview() {
  const modal = document.getElementById('sr-modal');
  if (modal) modal.classList.remove('open');
}

function showReviewQuestion() {
  const q = reviewQueue[reviewIndex];
  const progressEl = document.getElementById('sr-progress-text');
  const questionEl = document.getElementById('sr-question-text');
  const optionsEl = document.getElementById('sr-options');
  const feedbackEl = document.getElementById('sr-feedback');
  const nextBtn = document.getElementById('sr-next');

  progressEl.textContent = `Question ${reviewIndex + 1} of ${reviewQueue.length}`;
  questionEl.textContent = q.q;
  feedbackEl.style.display = 'none';
  feedbackEl.className = '';
  nextBtn.style.display = 'none';
  reviewAnswered = false;

  optionsEl.innerHTML = '';
  q.opts.forEach((opt, i) => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.className = 'quiz-option';
    btn.textContent = opt;
    btn.dataset.opt = i;
    btn.addEventListener('click', () => handleReviewAnswer(i, q));
    li.appendChild(btn);
    optionsEl.appendChild(li);
  });
}

function handleReviewAnswer(selected, q) {
  if (reviewAnswered) return;
  reviewAnswered = true;
  const correct = selected === q.correct;
  updateSR(q.id, correct);

  document.querySelectorAll('#sr-options .quiz-option').forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correct) btn.classList.add('correct');
    else if (i === selected && !correct) btn.classList.add('incorrect');
  });

  const feedbackEl = document.getElementById('sr-feedback');
  feedbackEl.style.display = 'block';
  feedbackEl.className = correct ? 'correct' : 'incorrect';
  feedbackEl.textContent = (correct ? '✓ Correct! ' : '✗ Incorrect. ') + q.exp;

  const nextBtn = document.getElementById('sr-next');
  nextBtn.style.display = 'inline-block';
  nextBtn.textContent = reviewIndex < reviewQueue.length - 1 ? 'Next →' : 'Finish';
  nextBtn.onclick = () => {
    reviewIndex++;
    if (reviewIndex < reviewQueue.length) {
      showReviewQuestion();
    } else {
      closeReview();
      if (window.recordActivity) window.recordActivity();
      const countEl = document.getElementById('review-count');
      if (countEl) countEl.textContent = getDueCount();
    }
  };
}

/* ─── Due Count Badge ─── */
function updateDueBadge() {
  const el = document.getElementById('review-count');
  if (el) el.textContent = getDueCount();
}

/* ─── Init Review Button ─── */
function initReviewPanel() {
  const panel = document.getElementById('review-panel');
  if (panel) panel.addEventListener('click', openReview);
  updateDueBadge();
}

document.addEventListener('DOMContentLoaded', () => {
  buildReviewModal();
  initReviewPanel();
  updateDueBadge();
});

window.openReview = openReview;
window.getDueCount = getDueCount;
window.ALL_QUESTIONS = ALL_QUESTIONS;
