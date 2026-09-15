const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');

// Added Listener for Search button (ie. submit event)
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let query = searchInput.value.trim();

    if (!query) return;

    if (!query.startsWith('http://') && !query.startsWith('https://')) {
    query = 'https://' + query;
    }

    window.location.href = query;
});

// JS for Notepad
const notepadWindow = document.getElementById('notepad-window');
const notepadIcon = document.getElementById('notepad-icon');
const notepadEditor = document.getElementById('xp-notepad');

const btnMinimize = document.querySelector('.xp-minimize');
const btnClose = document.querySelector('.xp-close');

if (btnClose) btnClose.removeAttribute('disabled');
if (btnMinimize) btnMinimize.removeAttribute('disabled');

// Added Local Storage, so that it can store whatever the user types in Notepad window for later
// First when the user opens the website, this part of the code loads the previously saved notes:
const savedNotes = localStorage.getItem('prism_notepad_content');
if (savedNotes !== null && notepadEditor) {
    notepadEditor.value = savedNotes;
}

// This part saves the content as the user types:
if (notepadEditor) {
    notepadEditor.addEventListener('input', () => {
    localStorage.setItem('prism_notepad_content', notepadEditor.value)
    });
}


//  Minimize/Close Notepad Window features here

function hideNotepad() { //This func. closes the notepad window and shows the icon
    notepadWindow.classList.add('hidden');
    notepadIcon.classList.remove('hidden');
}

function showNotepad() { // This func. shows the notepad window
    notepadWindow.classList.remove('hidden');
    if (notepadEditor) notepadEditor.focus();
}

if (btnMinimize) btnMinimize.addEventListener('click', hideNotepad);
if (btnClose) btnClose.addEventListener('click', hideNotepad);

if (notepadIcon) notepadIcon.addEventListener('click', showNotepad);

