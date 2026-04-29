/* tooltips.js — glossary tooltip injection */

const GLOSSARY_TERMS = {
  'compiler': {
    def: 'A program that translates C source code into machine code (a binary executable).',
    lesson: 'pages/phase1/setup.html',
  },
  'linker': {
    def: 'Combines compiled object files and libraries into a final executable.',
    lesson: 'pages/phase1/setup.html',
  },
  'pointer': {
    def: 'A variable that stores the memory address of another variable.',
    lesson: 'pages/phase2/pointers.html',
  },
  'dereference': {
    def: 'Reading the value at the address held by a pointer using the * operator.',
    lesson: 'pages/phase2/pointers.html',
  },
  'stack': {
    def: 'A region of memory for local variables and function call frames; automatically managed.',
    lesson: 'pages/phase3/memory-management.html',
  },
  'heap': {
    def: 'A region of memory for dynamic allocation via malloc/free; manually managed.',
    lesson: 'pages/phase3/memory-management.html',
  },
  'null terminator': {
    def: "A '\\0' byte that marks the end of a C string.",
    lesson: 'pages/phase2/arrays-strings.html',
  },
  'segfault': {
    def: 'Segmentation fault — a crash caused by accessing invalid memory.',
    lesson: 'pages/phase3/memory-management.html',
  },
  'scope': {
    def: 'The region of code where a variable is visible and accessible.',
    lesson: 'pages/phase1/functions.html',
  },
  'prototype': {
    def: 'A forward declaration of a function\'s signature (return type and parameter types) before its definition.',
    lesson: 'pages/phase1/functions.html',
  },
  'struct': {
    def: 'A user-defined type grouping related variables (fields) under one name.',
    lesson: 'pages/phase2/structures.html',
  },
  'typedef': {
    def: 'Creates a type alias. `typedef struct Point Point;` lets you write `Point` instead of `struct Point`.',
    lesson: 'pages/phase2/structures.html',
  },
  'malloc': {
    def: 'Allocates a block of bytes on the heap and returns a pointer to it.',
    lesson: 'pages/phase2/pointers.html',
  },
  'free': {
    def: 'Releases heap memory previously allocated with malloc/calloc/realloc.',
    lesson: 'pages/phase2/pointers.html',
  },
  'EOF': {
    def: 'End Of File — the value returned by fgetc and similar functions when the file ends or an error occurs.',
    lesson: 'pages/phase2/file-io.html',
  },
  'errno': {
    def: 'A global integer variable set by system calls to indicate the type of error that occurred.',
    lesson: 'pages/phase3/error-handling.html',
  },
  'buffer overflow': {
    def: 'Writing data beyond the end of an allocated buffer, corrupting adjacent memory.',
    lesson: 'pages/phase2/arrays-strings.html',
  },
  'undefined behaviour': {
    def: 'Code the C standard does not define — the compiler may do anything, including crashes or silent bugs.',
    lesson: 'pages/phase1/syntax.html',
  },
  'preprocessor': {
    def: 'The first phase of compilation. Handles #include, #define, and other directives.',
    lesson: 'pages/phase1/setup.html',
  },
  'header file': {
    def: 'A .h file containing declarations (prototypes, typedefs, macros) included by .c files.',
    lesson: 'pages/phase1/hello-world.html',
  },
  'recursion': {
    def: 'A function that calls itself. Requires a base case to terminate.',
    lesson: 'pages/phase3/recursion.html',
  },
  'linked list': {
    def: 'A data structure of nodes, each holding a value and a pointer to the next node.',
    lesson: 'pages/phase3/dynamic-data-structures.html',
  },
  'memory leak': {
    def: 'Heap memory that is allocated but never freed, growing until the process is killed.',
    lesson: 'pages/phase3/memory-management.html',
  },
  'null pointer': {
    def: 'A pointer with value 0/NULL that does not point to any valid memory.',
    lesson: 'pages/phase2/pointers.html',
  },
  'calloc': {
    def: 'Like malloc but zero-initialises the allocated memory. Takes element count and size.',
    lesson: 'pages/phase3/memory-management.html',
  },
  'realloc': {
    def: 'Resizes a previously allocated heap block. May move the block to a new address.',
    lesson: 'pages/phase3/memory-management.html',
  },
};

function getGlossaryRoot() {
  const path = location.pathname;
  if (path.includes('/pages/phase')) return '../../';
  if (path.includes('/tools/') || path.includes('/reference/')) return '../';
  return '';
}

function buildTooltip(term, data) {
  const popup = document.createElement('span');
  popup.className = 'tooltip-popup';
  popup.setAttribute('role', 'tooltip');
  const root = getGlossaryRoot();
  popup.innerHTML = `<span class="tt-term">${term}</span>${data.def}<br><a class="tt-link" href="${root}${data.lesson}#${term.replace(/\s+/g,'-').toLowerCase()}">→ Full glossary entry</a>`;
  return popup;
}

function initTooltips() {
  document.querySelectorAll('.glossary-term').forEach(span => {
    const term = span.dataset.term || span.textContent.toLowerCase();
    const data = GLOSSARY_TERMS[term];
    if (!data) return;

    span.setAttribute('tabindex', '0');
    span.setAttribute('aria-describedby', 'tt-' + term.replace(/\s+/g,'-'));

    const popup = buildTooltip(term, data);
    popup.id = 'tt-' + term.replace(/\s+/g,'-');
    span.appendChild(popup);

    const show = () => popup.classList.add('visible');
    const hide = () => popup.classList.remove('visible');

    span.addEventListener('mouseenter', show);
    span.addEventListener('mouseleave', hide);
    span.addEventListener('focus', show);
    span.addEventListener('blur', hide);
  });
}

document.addEventListener('DOMContentLoaded', initTooltips);
window.GLOSSARY_TERMS = GLOSSARY_TERMS;
