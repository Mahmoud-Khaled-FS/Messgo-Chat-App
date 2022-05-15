class Messages {
  static messagesList = [];
  chat = document.getElementById('chat');

  constructor(message, toUser, chatId, send = true) {
    this.messageText = message.messageContent;
    this.toUser = toUser;
    if (!chatId) {
      this.createNewChatMessages();
    }
    // console.log(toUser);
    this.chatId = chatId;
    this.date = new Date();
    const hours = this.date.getHours();
    this.messageDate =
      hours > 12 ? `${hours - 12}:${this.date.getMinutes()} PM` : `${hours}:${this.date.getMinutes()} AM`;
    this.createMessage();
    if (send) {
      console.log('aa');
      this.sendMessage();
    }
  }
  async sendMessage() {
    console.log(this.chatId);
    const message = {
      messageContent: this.messageText,
      date: this.date,
      messageType: 'text',
      // userId: user.
    };
    Messages.messagesList.push({ message: message, chatId: this.chatId });
    // this.status = 'sending';
    try {
      const res = await fetch('http://localhost:3000/chat/new-message', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ message: message, chatId: this.chatId }),
      });
      if (res.status === 202) {
        this.updateMessageState('sended');
      } else {
        this.updateMessageState('error');
      }
    } catch (err) {
      this.updateMessageState('error');
    }
  }
  createMessage() {
    this.messageElement = document.createElement('div');
    this.messageElement.setAttribute('data-sender', 'self');
    this.messageElement.className = 'message';
    this.messageElement.innerHTML = `
      <span class="message-text">${this.messageText}</span
      >
      <div class="message-info">
      <span class="message-date">${this.messageDate}</span>
      <span class="message-status sending"><i class="fa-regular fa-clock"></i></span>
      </div>
      `;
    this.chat.appendChild(this.messageElement);
  }
  updateMessageState(state) {
    const statusClass = {
      sending: 'fa-regular fa-clock',
      sended: 'fa-solid fa-check',
      error: 'fa-solid fa-circle-exclamation',
    };
    const statusElemnt = this.messageElement.querySelector('.message-status');
    statusElemnt.classList.remove('sending');
    statusElemnt.classList.remove('sended');
    statusElemnt.classList.remove('error');
    statusElemnt.classList.add(state);
    statusElemnt.firstChild.className = statusClass[state];
  }
  async createNewChatMessages() {
    // console.log('create new chat');
    const id = this.toUser;
    // console.log(id);
    const result = await fetch('http://localhost:3000/chat/create-new-chat', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ userId: id }),
    });
    const data = await result.json();
    this.chatId = data.chatId;
    // if(data.messages){
    //   Messages.
    // }
    const chatIndex = Chat.chats.findIndex((chat) => this.toUser === chat.chat.content.userId);
    if (chat !== -1) {
      Chat.chats[chatIndex].chat.chatId = this.chatId;
    }
    // console.log(chatIndex);
  }
  static createMessagesChat(messages, chat, newMessage) {
    const contianer = chat.querySelector('#chat');
    Messages.messagesList.push(...messages);
    for (const message of messages) {
      const date = new Date(message.date);
      const hours = date.getHours();
      const dateMessage = hours > 12 ? `${hours - 12}:${date.getMinutes()} PM` : `${hours}:${date.getMinutes()} AM`;
      const messageElement = document.createElement('div');
      messageElement.setAttribute('data-sender', message.sender ? 'self' : 'user');
      messageElement.className = 'message';
      messageElement.innerHTML = `
      <span class="message-text">${message.messageContnet}</span
      >
      <div class="message-info">
      <span class="message-date">${dateMessage}</span>
      <span class="message-status sended"><i class="fa-solid fa-check"></i></span>
      </div>
      `;
      contianer.appendChild(messageElement);
      if (!newMessage) {
        contianer.scrollTop = contianer.scrollHeight;
      }
      contianer.scroll({ top: contianer.scrollHeight, behavior: 'smooth' });
    }
  }
}
