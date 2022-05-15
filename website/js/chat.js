class Chat {
  static chats = [];
  static activeChat;
  constructor(content) {
    Chat.activeChat = this;
    // socket.emit('hello',()=>{
    // })
    this.chatId;
    this.content = content;
    this.demo = true;
    this.messageCount = 0;
    this.getChat();

    // console.log(Chat.chats);
    if (this.chatId) {
      // console.log('010');
      this.demo = false;
      console.log(this.demo);
    }
    const chatContainer = document.getElementById('chatContainer');
    if (Chat.chats.length > 0) {
      for (const chat of Chat.chats) {
        chat.element.remove();
      }
      for (const chat of Chat.chats) {
        if (this.chatId === chat.chat.chatId) {
          chatContainer.appendChild(chat.element);
          return;
        }
      }
    } else {
      const noChat = document.querySelector('.no-chat');
      if (noChat) {
        // console.log(noChat);
        noChat.remove();
      }
    }
    // socket.on('first-chat', () => console.log('new chat.....'));
    this.createChat();
    this.createChatFunction();
    // this.getChatMessages();
  }
  createChat() {
    const chatContainer = document.getElementById('chatContainer');
    const chat = document.createElement('div');
    this.chat = chat;
    if (!this.demo) {
      // console.log('push');
      Chat.chats.push({ element: this.chat, chat: this });
    }
    chat.className = 'chat';
    chat.innerHTML = `
    <div class="header">
      <div class="image">
        <img src="${this.content.imageUrl}" alt="profile" />
      </div>
      <div class="chat-info">
        <h4>${this.content.name}</h4>
        <span class="date">Last Seen 3 hours ago</span>
      </div>
      <div class="controlle">
        <button><i class="fa-solid fa-phone"></i></button>
        <button><i class="fa-solid fa-video"></i></button>
        <button><i class="fa-solid fa-ellipsis"></i></button>
      </div>
    </div>
    <div class="content">
      <div class="chat-container" id="chat"></div>
    </div>
    <footer>
      <div class="input">
        <button id="media" ><i class="fa-solid fa-paperclip"></i></button>
        <button><i class="fa-solid fa-face-grin"></i></button>
        <input id="messageInput" type="text" placeholder="Type a message here..." />
        </div>
        <div class="send">
        <button hidden id="sendButton"><i class="fa-solid fa-paper-plane"></i></button>
        <button id="recordButton"><i class="fa-solid fa-microphone"></i></i></button>
        </div>
        </footer>
        `;
    chatContainer.appendChild(chat);
  }
  createChatFunction() {
    const sendButton = document.getElementById('sendButton');
    const messageInput = document.getElementById('messageInput');
    const recordButton = document.getElementById('recordButton');
    const mediaSenderButton = document.getElementById('media');
    const chatContainer = document.getElementById('chat');
    // console.log()
    // chatContainer.scrollTop = ;

    // console.log(sendButton, messageInput);
    messageInput.oninput = () => {
      if (messageInput.value.length > 0) {
        recordButton.hidden = true;
        sendButton.hidden = false;
      } else {
        recordButton.hidden = false;
        sendButton.hidden = true;
      }
    };
    // chatContainer.scroll({ behavior: 'smooth', top: 0 });
    const sendMessageHandler = () => {
      this.demo = false;
      this.messageCount += 1;
      if (this.messageCount === 1 && !this.chatId) {
        // console.log('push');
        Chat.chats.push({ element: this.chat, chat: this });
      }
      if (messageInput.value.length > 0) {
        const message = new Messages(
          {
            messageContent: messageInput.value,
            messageType: 'text',
          },
          this.content.userId,
          this.chatId
        );
        // chatContainer.scroll({ top: chatContainer.clientHeight });
        chatContainer.scroll({ top: chatContainer.scrollHeight, behavior: 'smooth' });
        messageInput.value = '';
        recordButton.hidden = false;
        sendButton.hidden = true;
      } else {
        return false;
      }
    };
    sendButton.addEventListener('click', sendMessageHandler);

    document.onkeyup = (e) => {
      if (e.code === 'Enter') {
        sendMessageHandler();
      }
    };
    mediaSenderButton.onclick = this.createChatMediaSender.bind(this);
  }
  createChatMediaSender() {
    let box = document.getElementById('mediaBox');
    if (box) {
      return box.remove();
    }
    box = document.createElement('div');
    box.className = 'media-box';
    box.id = 'mediaBox';
    box.innerHTML = `
    <button><i class="fa-solid fa-image"></i></button>
    <button><i class="fa-solid fa-camera"></i></button>
    <button><i class="fa-solid fa-file"></i></button>
    `;
    this.chat.appendChild(box);
  }
  async getChat() {
    const dataChat = await fetch('http://localhost:3000/chat/' + this.content.userId);
    const chat = await dataChat.json();
    // console.log(chat);
    if (!chat.chatId) {
      return console.log('no chat founded');
    }
    // console.log(chat);
    if (chat.messages) {
      Messages.createMessagesChat(chat.messages, this.chat);
    }
    this.chatId = chat.chatId;
    const chatIndex = Chat.chats.findIndex((chat) => chat.chat.chatId === this.chatId);
    if (chatIndex === -1) {
      Chat.chats.push({ element: this.chat, chat: this });
    }
  }
}
