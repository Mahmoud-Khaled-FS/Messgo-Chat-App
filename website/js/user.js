const DUMMY_DATA = [
  {
    imageUrl: './assets/profile/profile1.jpg',
    name: 'Mahmoud Khaled',
    recentMessageText: 'Hello',
    recentMessageDate: '2:20 AM',
    chatID: '1',
  },
  {
    imageUrl: './assets/profile/profile2.jpg',
    name: 'Ran',
    recentMessageText: 'how are you?',
    recentMessageDate: '1:15 AM',
    chatID: '2',
  },
  {
    imageUrl: './assets/profile/profile3.jpg',
    name: 'Omar Sayed',
    recentMessageText: 'bye',
    recentMessageDate: '3:11 pM',
    chatID: '3',
  },
  {
    imageUrl: './assets/profile/profile4.jpg',
    name: 'Mohamed Hassan',
    recentMessageText: 'hi!',
    recentMessageDate: '8:50 AM',
    chatID: '4',
  },
];
class User {
  // io.emit
  constructor(cd) {
    // this.token = token;
    this.id;
    this.createContactsRcentChat();
    (async () => {
      try {
        const DataUser = await fetch('http://localhost:3000/myid');
        const user = await DataUser.json();
        this.id = user.id;
        // console.log(this.id);
        cd();
        socket.emit('userConnected', this.id);
      } catch (err) {
        this.id = null;
      }
    })();
  }
  // async getUser() {
  //   try {
  //     const DataUser = await fetch('http://localhost:3000/myid');
  //     const user = await DataUser.json();
  //     this.id = user.id;
  //     console.log(this.id);
  //     return this.id;
  //   } catch (err) {
  //     this.data = null;
  //   }
  // }
  async createContactsRcentChat() {
    const container = document.getElementById('side-banal-container');
    if (container.children[0]) {
      container.children[0].remove();
    }
    const contactsElemnts = document.createElement('div');
    contactsElemnts.className = 'contacts';
    const result = await fetch('http://localhost:3000/user/recent-chat');
    const contactsData = await result.json();
    console.log(contactsData);
    for (const contact of contactsData.recentChats) {
      const contactElement = document.createElement('div');
      const date = new Date(contact.lastMessageDate);
      // contactElement.id = 'contact';
      const hours = date.getHours();
      const messageDate = hours > 12 ? `${hours - 12}:${date.getMinutes()} PM` : `${hours}:${date.getMinutes()} AM`;
      contactElement.className = 'contact';
      contactElement.innerHTML = `
      <div class="image">
      <img src="${contact.imageUrl}" alt="profile" />
      </div>
      <div class="message-info">
      <h4>${contact.name}</h4>
      <p class="message">${contact.lastMessageText}</p>
      <span class="date">${messageDate}</span>
      </div>
      `;
      contactElement.onclick = (e) => {
        const chat = new Chat(contact);
        for (const contact of contactsElemnts.children) {
          // console.log(contact);
          contact.classList.remove('chat-active');
        }
        e.currentTarget.classList.add('chat-active');
      };
      contactsElemnts.appendChild(contactElement);
    }
    // console.log(container.children);
    container.appendChild(contactsElemnts);
  }
  async createFriends() {
    const container = document.getElementById('side-banal-container');
    if (container.children[0]) {
      container.children[0].remove();
    }
    const contactsElemnts = document.createElement('div');
    contactsElemnts.className = 'contacts friends';
    try {
      const friendsData = await fetch('http://localhost:3000/friends');
      const friends = await friendsData.json();
      if (!friends.friendsList) {
        contactsElemnts.innerHTML = '<p>No Friends Founded Add New Friend</p>';
        return container.appendChild(contactsElemnts);
      }
      // console.log(friends);
      for (const contact of friends.friendsList) {
        const contactElement = document.createElement('div');
        contactElement.className = 'contact friend';
        contactElement.innerHTML = `
        <div class="image">
        <img src="${contact.imageUrl}" alt="profile" />
        </div>
        <h4>${contact.name}</h4>
        `;
        contactElement.onclick = (e) => {
          // console.log(contact);
          const chat = new Chat(contact);
          for (const contact of contactsElemnts.children) {
            // console.log(contact);
            contact.classList.remove('chat-active');
          }
          e.currentTarget.classList.add('chat-active');
        };
        contactsElemnts.appendChild(contactElement);
      }
      container.appendChild(contactsElemnts);
    } catch (err) {
      contactsElemnts.classList.add('error');
      contactsElemnts.innerHTML = '<p>Something Wrong</p>';
      container.appendChild(contactsElemnts);
    }
  }
  async addFriend(id) {
    const data = await fetch('http://localhost:3000/user/addfriend', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ userId: id }),
    });

    console.log(await data.json());
    // console.log(pop);
    this.createFriends();
  }
}
