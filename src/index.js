import template from '../friends.hbs';

const loadedInput = document.querySelector('.loaded-friends');
const dndInput = document.querySelector('.dnd-friends');
const friendsUrl = [
    'https://reqres.in/api/users?page=1',
    'https://reqres.in/api/users?page=2',
    'https://reqres.in/api/users?page=3'
];

const request = async url => {
    const response = await fetch(url);
    const json = await response.json();
    const arr = await json.data

    return arr;
}

const getFriendslist = async () => {
    let friends = [];

    for (const url of friendsUrl) {
        const res = await request(url);
        friends = friends.concat(res);
    }

    return friends
}

getFriendslist().then(res => {
    const friends = {};
    friends.items = res;
    const html = template(friends);
    const results = document.querySelector('#friends');
    const to = document.querySelector('.to');
    const from = document.querySelector('.from')
    let dataFrom = localStorage.getItem('dataFrom');
    let dataTo = localStorage.getItem('dataTo');

    to.innerHTML = dataTo;
    if (dataFrom) {
        results.innerHTML = dataFrom;
    } else {
        results.innerHTML = html;
    }
})

const save = document.querySelector('#save');

save.addEventListener('click', () => {
    const to = document.querySelector('.to');
    const from = document.querySelector('.from');
    
    localStorage.setItem('dataTo', to.innerHTML);
    localStorage.setItem('dataFrom', from.innerHTML);
})

const filterFriends = () => {
    const from = document.querySelector('.from');
    const to = document.querySelector('.to');
    const friendsFrom = from.querySelectorAll('.full-name');
    const friendsTo = to.querySelectorAll('.full-name');

    for (const friend of friendsFrom) {
        if (!(friend.textContent.includes(loadedInput.value))) {
            friend.parentElement.classList.add('hidden');
        } else {
            friend.parentElement.classList.remove('hidden');
        }
    }
    
    for (const friend of friendsTo) {
        if (!(friend.textContent.includes(dndInput.value))) {
            friend.parentElement.classList.add('hidden');
        } else {
            friend.parentElement.classList.remove('hidden');
        }
    }
};

loadedInput.addEventListener('input', filterFriends);

dndInput.addEventListener('input', filterFriends);

let currentDrag;

document.addEventListener('click', (e) => {
    const to = document.querySelector('.to');
    const from = document.querySelector('.from');

    if (e.target.classList.contains('add-button')) {
        e.target.classList.replace('add-button', 'remove-button');
        to.appendChild(e.target.parentNode);
    } else if (e.target.classList.contains('remove-button')) {
        e.target.classList.replace('remove-button', 'add-button');
        from.appendChild(e.target.parentNode);
    }
})

document.addEventListener('dragstart', (e) => {
    const zone = getCurrentZone(e.target);

    if (zone && e.target.tagName !== 'IMG') {
        currentDrag = { startZone: zone, node: e.target };
    }
});

document.addEventListener('dragover', (e) => {
    const zone = getCurrentZone(e.target);

    if (zone) {
        e.preventDefault();
    }
});

document.addEventListener('drop', (e) => {
    if (currentDrag) {
        const zone = getCurrentZone(e.target);

        e.preventDefault();

        if (zone && currentDrag.startZone !== zone) {
            zone.appendChild(currentDrag.node);

            currentDrag.node.lastElementChild.classList.toggle('add-button');
            currentDrag.node.lastElementChild.classList.toggle('remove-button');
        }

        currentDrag = null;
    }
});

const getCurrentZone = from => {
    do {
        if (from.classList.contains('drop-zone')) {
            return from;
        }
    } while (from = from.parentElement);

    return null;
}