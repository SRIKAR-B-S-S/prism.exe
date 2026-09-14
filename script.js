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