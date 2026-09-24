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
    localStorage.setItem('prism_notepad_content', notepadEditor.value);

    const charCount = document.getElementById('char-count');
    if (charCount) {
        charCount.textContent = `Ln 1, Col 1 | Char: ${notepadEditor.value.length}`; // updates the no.of characters as the user types
    }
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
}

if (bmForm){ //moved this out of the update bookmarks function as it previously caused the website to show the Maximum Alert dialog 7 times and it also showed the Maximum Alert dialog when adding the 6th bookmark(which it shouldn't!)
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

window.removeBookmark = function(index) {
    bookmarks.splice(index, 1);
    updateBookmarksUI();
};

if (bmAppIcon) bmAppIcon.addEventListener('click', () => bmWindow.classList.remove('hidden'));
if (bmCloseBtn) bmCloseBtn.addEventListener('click', () => bmWindow.classList.add('hidden'));

updateBookmarksUI();

// Everything about the Background Settings below!

const THEME_PRESETS = [
{
    id: 'default-silver',
    name: 'Silver Explorer',
    bg: 'radial-gradient(circle at center, #f5f7fa 0%, #e4e8ec 100%)',
    logoColor: '#4a5568'
},
{
    id: 'dark-UI',
    name: 'Dark UI',
    bg: 'radial-gradient(circle at center, #2d3748 0%, #1a202c 100%)',
    logoColor: '#cbd'
},
{
    id: 'mint',
    name: 'Mint',
    bg: 'radial-gradient(circle at center, #c9eeff 0%, #43a6b5 100%',
    logoColor: '#ffc3c3'
},
{
    id: 'purple',
    name: 'Pleasant Purple',
    bg: 'radial-gradient(circle at center, #877bb0 0%, #51486e 100%',
    logoColor: '#dcd1ff'
},
{
    id:'nature',
    name: 'Nature',
    bg: 'radial-gradient(circle at center, #9fc7a0 0%, #88b98a 100%',
    logoColor: '#ffff70'
},
{
    id: 'pink',
    name: 'Pink!',
    bg: 'radial-gradient(circle at center, #fab4e5 0%, #cc6496b0 100%',
    logoColor: '#6e0e49'
}
];

const settingsWindow = document.getElementById('settings-window');
const settingsIcon = document.getElementById('settings-icon');
const settingsClosebtn = document.querySelector('.xp-settings-close');
const themeDiv = document.getElementById('theme-options-div');

function applyTheme(theme) { // this is function to apply the selected theme by the user in Settings window
    document.documentElement.style.setProperty('--desktop-bg', theme.bg);
    document.documentElement.style.setProperty('--logo-color', theme.logoColor);

    if (theme.id == 'dark-UI' || theme.id == 'purple') { // added this so that it automatically changes the color of time-widget to white for the two dark coloured background which are darkUI and purple
        document.querySelector('.time-widget').classList.add('white');
    } else {document.querySelector('.time-widget').classList.remove('white')}

    localStorage.setItem('prism_selected_theme', theme.id);

    document.querySelectorAll('.theme-option').forEach((card) => {    // gives the active state for the selected theme option
        card.classList.toggle('active', card.dataset.themeId === theme.id);
    });
}

function initThemeSettings() {
    const savedThemeId = localStorage.getItem('prism_selected_theme') || 'default-silver'; //retrieves previously saved theme & if nothing found uses the default background if its the user's first time
    let activeTheme = THEME_PRESETS.find((t) => t.id === savedThemeId) || THEME_PRESETS[0]; //searches for saved themes from the above data of theme presets

    THEME_PRESETS.forEach((theme) => { // For each object in the theme presets data, it will create styles and add them into the settings window(along w/ the click listener)
        const card = document.createElement('div');
        card.className = `theme-option ${theme.id === activeTheme.id ? 'active' : ''}`;
        card.dataset.themeId = theme.id;

        const preview = document.createElement('div');
        preview.className = 'theme-preview';
        preview.style.background = theme.bg;

        const nameSpan = document.createElement('span');
        nameSpan.textContent = theme.name;

        card.appendChild(preview);
        card.appendChild(nameSpan);

        card.addEventListener('click', () => applyTheme(theme)); //a click on the theme option would make apply that theme using the function which we defined above.
        themeDiv.appendChild(card);
    }
);
applyTheme(activeTheme);
}

if (settingsIcon) settingsIcon.addEventListener('click', () => settingsWindow.classList.remove('hidden'));
if (settingsClosebtn) settingsClosebtn.addEventListener('click', () => settingsWindow.classList.add('hidden'));
//out of the above two, one makes the window visible when clicked on the desktop icon and the other minimizes the settings window when the close button is clicked.

initThemeSettings();

function updateClock() {
    const timeDiv = document.getElementById('time');

    if (!timeDiv) return;
    const now = new Date();
    
    const Time = now.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    
    const weekday = now.toLocaleDateString([], {weekday: 'short'});
    const day = now.toLocaleDateString([], {day: '2-digit'});
    const month = now.toLocaleDateString([], {month: '2-digit'});
    const year = now.toLocaleDateString([], {year:'2-digit'});

    timeDiv.textContent = day + "/" + month + "/" + year + " | " + Time; // gives an output like - DD/MM/YY | HH:MM AM/PM
}

updateClock();
setInterval(updateClock, 1000); //updates the clock every 1000ms which is 1s

// Added function to retrieve data about a random tech device from the Y2K era using the API data of my last project!
const infoLabel = document.getElementById('info');
async function getData() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/SRIKAR-B-S-S/Cyber3000/refs/heads/main/API/y2ktech.json');
        const data = await response.json();

        const random_itemIndex = Math.floor(Math.random() * data.length); //gets a random object from the .json file
        
        const random_item = data[random_itemIndex]; //fetches the data of that random object using its index
        infoLabel.innerHTML = `<b>${random_item.name}</b>: ${random_item.details}`; //adds the details to html <span>
    }
    catch (error) {
        infoLabel.textContent = 'Error :(';
    }
}

getData();