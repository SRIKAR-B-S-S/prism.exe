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


let bookmarks = JSON.parse(localStorage.getItem('prism_bookmarks')) || [];

const bmView = document.getElementById('bookmarks-div');
const bmWindow = document.getElementById('bookmarksmanager-window');
const bmAppIcon = document.getElementById('bookmarks-manager-icon');
const bmCloseBtn = document.querySelector('.xp-bm-close');
const bmForm = document.getElementById('bm-form');
const bmNameInput = document.getElementById('bm-name-input');
const bmUrlInput = document.getElementById('bm-url-input');
const bmList = document.getElementById('bm-list-items');

function updateBookmarksUI() {
        bmView.innerHTML = '';
        bmList.innerHTML = '';
    if (bookmarks.length === 0) { // shows the user that he has no bookmarks added currently
        const emptyNotice = document.createElement('p');
        emptyNotice.className = 'no-bookmarks-text';
        emptyNotice.textContent = 'No bookmarks added currently, add them from Bookmarks Manager';
        bmView.appendChild(emptyNotice);
    } 
    
    else {
        bookmarks.forEach((item, index) => { //if atleast one bookmark(or more obviously) is found, it displays it 1-under the searchbar and 2-in the bookmarks manager
            let siteUrl = item.url;
            if (!siteUrl.startsWith('https://') && !siteUrl.startsWith('http://')) {
                siteUrl = 'https://' + siteUrl;
            }

        const card = document.createElement('div');
        card.className = 'bookmark-card';
        const iconUrl = 'https://www.google.com/s2/favicons?sz=64&domain_url=' + siteUrl;

        card.innerHTML = `<img src=${iconUrl} class="bookmark-img"/> <span class="bookmark-label">${item.name}</span>`

        card.addEventListener('click', () => {
            window.location.href = siteUrl;
        });
        bmView.appendChild(card);

        const li = document.createElement('li');
        li.className = 'bm-list-item';
        li.innerHTML = `<span><strong>${item.name}</strong> (${item.url})</span>       <button class="bm-delete-btn" onClick="removeBookmark(${index})">Remove</button>`;
        
        bmList.appendChild(li);
        });
    }
    localStorage.setItem('prism_bookmarks', JSON.stringify(bookmarks)); // removed this line which was previously in the else{}, which did not allow the user's most recently added bookmark to be removed, like it made the user's most recently added bookmark to appear again after removing it when the website was reloaded.

if (bmForm){
    bmForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if(bookmarks.length >= 6) { //Just in case if the user tries to add more than 6 bookmarks, because as far as I've designed, 6 bookmarks feel perfect under the searchbar
            alert(`Maximum limit reached! You can store only upto 6 bookmarks!`);
            return;
        }

        const name = bmNameInput.value.trim();
        const url = bmUrlInput.value.trim();

        if (name && url) {
            bookmarks.push({name,url});
            bmNameInput.value = '';
            bmUrlInput.value = '';
            updateBookmarksUI();
        }
    });
}
}

window.removeBookmark = function(index) {
    bookmarks.splice(index, 1);
    updateBookmarksUI();
};

if (bmAppIcon) bmAppIcon.addEventListener('click', () => bmWindow.classList.remove('hidden'));
if (bmCloseBtn) bmCloseBtn.addEventListener('click', () => bmWindow.classList.add('hidden'));

updateBookmarksUI();