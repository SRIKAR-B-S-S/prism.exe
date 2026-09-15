function isURL(string) {
    if(string.includes(' ')) return false;

    try {

        const hasProtocol = string.startsWith('https://') || string.startsWith('http://');
        const urlToCheck = hasProtocol ? string: 'https://' + string;
        //above two lines add https:// or http:// if the entered url doesn't contain them

        parsedURL = new URL(urlToCheck);

        return parsedURL.hostname.includes('.'); //returns true if the url contains a dot(.) because that's a must for a valid URL
    }
    catch(_) {
        return false;
    }
}


const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');

// Updated Listener for Search button, differentiated the searchbar into two parts - 1. Text/keyword entered - takes the user to google [or] 2. URL entered - takes the user to that website

if (searchForm && searchInput) {
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const rawInput = searchInput.value.trim();
        if (!rawInput) return; // do nothing if the searchbar is empty

        if (isURL(rawInput)) { // if the user entered a URL, it takes redirects to that website.
            // the above if statment uses the funcion which we defined at the starting of the page if the give input in searchbar is a url or not
            const targetUrl = rawInput.startsWith('https://') || rawInput.startsWith('http://') ? rawInput : 'https://' + rawInput;
            window.location.href = targetUrl;
        }
        else { // does this if the user entered a keyword or text in the searchbar, ie. opens google with that text searched
            const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(rawInput)}`;
            window.location.href = searchUrl;
        }
        
    });
}

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

