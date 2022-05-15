let user;
const socket = io();
window.addEventListener('load', async function () {
  // console.log(user.id);
  user = new User(() => {
    document.querySelector('.loading').remove();
    // console.log(user);
    socket.emit('join', { userId: user.id }, (err) => console.log(err));
  });
  // console.log(user.);
});
socket.on('message', (data) => {
  Messages.createMessagesChat([data.message], Chat.activeChat.chat, true);
});
socket.on('', (data) => {
  Messages.createMessagesChat([data.message], Chat.activeChat.chat, true);
});
const chatsButton = document.getElementById('chats-button');
const friendsButton = document.getElementById('friends-button');

chatsButton.onclick = recentChatHandler;
friendsButton.onclick = friendsHandler;

function friendsHandler() {
  const titelAside = document.querySelector('aside .content .header h3');
  const buttonAside = document.querySelector('aside .content .header button');
  buttonAside.onclick = createPop;
  titelAside.textContent = 'Friends';
  buttonAside.textContent = 'Add Friends';
  setActiveClass(friendsButton.parentElement);
  user.createFriends();
}
function recentChatHandler() {
  const titelAside = document.querySelector('aside .content .header h3');
  const buttonAside = document.querySelector('aside .content .header button');
  titelAside.textContent = 'Recent Chats';
  buttonAside.textContent = '+ New Chat';
  setActiveClass(chatsButton.parentElement);
  user.createContactsRcentChat();
}

function setActiveClass(element) {
  // console.log(element);
  const lis = document.querySelectorAll('nav ul li');
  for (const li of lis) {
    li.classList.remove('active');
  }
  element.classList.add('active');
}

function createPop() {
  const pop = document.createElement('div');
  pop.className = 'pop';
  pop.innerHTML = `
  <div class="content">
    <div class="header">
      <div class="search">
        <input id="searchNewUser" type="text" placeholder="Search" />
        <i class="fa-solid fa-magnifying-glass"></i>
      </div>
      <button onclick="searchUserHandler()">Search</button>
    </div>
    <div class="search-content">
      </div>
    </div>
  </div>
  `;
  document.body.appendChild(pop);
}
async function searchUserHandler() {
  const userSearchValue = document.getElementById('searchNewUser').value;
  // console.log(userSearchValue);
  const container = document.querySelector('.search-content');
  try {
    const data = await fetch('http://localhost:3000/search/user', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ name: userSearchValue }),
    });
    const dataUsers = await data.json();
    // console.log(dataUsers);
    if (!dataUsers.usersList) {
      container.textContent = 'No Users Founded';
    }
    for (const user of dataUsers.usersList) {
      container.innerHTML += `
      <div class="user" onclick="addFrindHandler(this)">
      <div class="image">
      <img src="${user.imageUrl}" alt="profile" />
      <input type="hidden" value="${user.id}">
      </div>
      <h4>${user.name}</h4>`;
    }
  } catch (err) {
    console.log(err);
  }
}
async function addFrindHandler(e) {
  const userId = e.querySelector('input').value;
  console.log(userId);
  // console.log(user);
  await user.addFriend(userId);
  const pop = document.getElementsByClassName('pop')[0];
  pop.remove();
  // user.addFriend(userId);
}
