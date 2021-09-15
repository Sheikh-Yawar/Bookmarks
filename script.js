const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

let bookmarks = [];

//*Show Modal,Focus on input
const showModal = function () {
    modal.classList.add('show-modal');
    websiteNameEl.focus();
}


//* Modal Event Listener
modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', () => {
    modal.classList.remove('show-modal')
});
window.addEventListener('click', (e) => {
    e.target === modal ? modal.classList.remove('show-modal') : false;
});

//*Validate Form
const validate = function (nameValue, urlValue) {
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;

    const regex = new RegExp(expression);

    if (!nameValue || !urlValue) {
        alert('Please! submit valued for both fields');
        return false;
    }

    if (urlValue.match(regex)) {
        // *Continue
    }
    else {
        alert('Please!provide a valid web address');
        return false;
    }
    return true;
}

//*Delete Bookmark
const deleteBookmark = function (url) {
    bookmarks.forEach((bookmark, i) => {
        if (bookmark.url === url) {
            bookmarks.splice(i, 1);
        }
    });

    //* Update bookmarks array in localStorage,re-populate DOM
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
}

//* Build   Bookmarks DOM
const buildBookmarks = function () {
    //* Remove all bookmark elements
    bookmarksContainer.textContent = ' ';
    //*Build Items
    bookmarks.forEach((bookmark) => {
        const { name, url } = bookmark;
        //* Item
        const item = document.createElement('div');
        item.classList.add('item');

        //*Close
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fas', 'fa-trash');
        closeIcon.setAttribute('titile', 'Delete Bookmark');
        closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`);

        //* favicon/Link Container
        const linkInfo = document.createElement('div');
        linkInfo.classList.add('name');
        const favicon = document.createElement('img');
        favicon.setAttribute('src', `http://www.google.com/s2/favicons?domain=${url}/`);
        favicon.setAttribute('alt', 'Favicon');
        //* Anchor tag
        const link = document.createElement('a');
        link.setAttribute('href', `${url}`);
        link.setAttribute('target', '_blank');
        link.textContent = name;
        //* Append to bookmarks Container
        linkInfo.appendChild(favicon, link);
        item.appendChild(closeIcon, linkInfo);
        bookmarksContainer.appendChild(item);
    });
}
//* Fetch Bookmarks from Local Storgae
const fetchBookmarks = function () {
    //* Get bookmarks from localStorage if available
    if (localStorage.getItem('bookmarks')) {
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    }

    buildBookmarks();
}


//*Handle Data From BookMark
const storeBookMark = function (e) {
    e.preventDefault();
    const nameValue = websiteNameEl.value;
    let urlValue = websiteUrlEl.value;

    if (!urlValue.includes('https://') && !urlValue.includes('http://')) {
        urlValue = `https://${urlValue}`;
    }
    if (!validate(nameValue, urlValue))
        return false;

    const bookmark = {
        name: nameValue,
        url: urlValue,
    };

    bookmarks.push(bookmark);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
    bookmarkForm.reset();
    websiteNameEl.focus();

}

//* Event Listener
bookmarkForm.addEventListener('submit', storeBookMark);

//* On load// Fetch BookMarks
fetchBookmarks();