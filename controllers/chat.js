const path = require('path');
const User = require('./../models/user');
const Chat = require('./../models/chat');
const { randomUUID } = require('crypto');
const io = require('./../socket');
// io.getIo().on('connect', function (socket) {
//   // console.log('connect');
//   socket.on('userConnected', socket.join);
// });
// const { body } = require('express-validator');

exports.getChat = (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'pages', 'index.html'));
};

exports.getChatdb = async (req, res) => {
  const userIdChat = req.params.userId;
  try {
    const user = await User.findById(req.userId).populate('chats');
    // console.log(user.chats);
    if (!user) {
      throw new Error('user Not found');
    }
    const userChats = user.chats;
    if (!userChats) {
      throw new Error('chats Not found');
    }
    for (const chat of userChats) {
      // console.log(chat);
      const userIndex = chat.usersId.findIndex((id) => userIdChat === id.toString());
      if (userIndex !== -1) {
        let messages = null;
        if (chat.messages.length > 0) {
          messages = chat.messages.map((message) => {
            // console.log(message.userId);
            // console.log(req.userId);
            let sender = message.userId.toString() === req.userId ? true : false;
            return { ...message._doc, sender: sender };
          });
        }
        return res.status(202).json({ chatId: chat._id, messages: messages });
      }
    }
    return res.status(202).json({ message: 'chat not found' });
  } catch (err) {
    console.log(err);
  }
  // const a = []
  // a.find
};

exports.postCreateNewChat = async (req, res) => {
  // io.getIo().emit('first-chat', () => console.log('new chat'));

  const userId = req.body.userId;
  try {
    const selfUser = await User.findById(req.userId);
    const toUser = await User.findById(userId);
    const chat = new Chat({ usersId: [selfUser._id, toUser._id] });
    await chat.save();
    // console.log(selfUser);
    selfUser.chats.push(chat._id);
    toUser.chats.push(chat._id);
    await selfUser.save();
    await toUser.save();
    return res.status(201).json({ chatId: chat._id });

    // return res.status(201).json({chatId :chatRes._id})
  } catch (err) {
    console.log(err);
  }
};

exports.postCreateNewMessage = async (req, res) => {
  // console.log(req.chatId);
  const { messageContent, messageType, date } = req.body.message;
  // console.log(req.body);
  const message = {
    userId: req.userId,
    messageType: messageType,
    messageContnet: messageContent,
    date: date,
    messageId: randomUUID(),
  };
  try {
    const chat = await Chat.findById(req.body.chatId);
    const toUser = chat.usersId.find((id) => id.toString() !== req.userId);
    // console.log(toUser);
    if (!chat) {
      return console.log('error');
    }
    chat.messages.push(message);
    await chat.save();

    // console.log(req.ioId);
    // console.log(io.getIo().engine.server);
    io.getIo().sockets.to(toUser.toString()).emit('message', { message: message });
    res.status(202).json({ message: message });
  } catch (err) {
    console.log(err);
  }
};
