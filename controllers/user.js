const User = require('../models/user');
const Chat = require('../models/chat');
exports.getId = (req, res) => {
  console.log(req.userId);
  res.status(202).json({ id: req.userId });
};
exports.getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('friends');
    if (!user) {
      return console.log('no user founded');
    }
    if (user.friends.length === 0) {
      return res.status(202).json({ message: 'no user foundes' });
    }
    const friendsList = user.friends.map((friend) => {
      return { imageUrl: friend.config.imageUrl, name: friend.fullName, userId: friend._id };
    });
    return res.status(202).json({ friendsList: friendsList });
  } catch (err) {
    console.log(err);
  }
};

exports.postUsersSearch = async (req, res) => {
  const usersName = req.body.name;
  // console.log(req.body);
  try {
    const users = await User.find({
      fullName: { $regex: usersName, $options: 'i' },
      // $and: [{ _id: { $ne: req.userId } }],
    })
      .limit(4)
      .skip();

    if (!users) {
      return console.log('no users founded');
    }
    if (users.length === 0) {
      return res.status(202).json({ message: 'no users foundes' });
    }
    const usersRes = users.map((user) => {
      return { name: user.fullName, imageUrl: user.config.imageUrl, id: user._id.toString() };
    });
    // console.log(usersRes);
    return res.status(202).json({ usersList: usersRes });
  } catch (err) {
    console.log(err);
  }
};

exports.postAddUser = async (req, res) => {
  try {
    const selfUser = await User.findById(req.userId);
    const wasAdded = selfUser.friends.findIndex((id) => id === req.body.userId);
    // console.log(wasAdded, '\n', selfUser.friends);
    if (wasAdded !== -1) {
      return res.status(202).json({ message: 'user was added before' });
    }
    const friendUser = await User.findById(req.body.userId);
    if (!friendUser) {
      throw new Error('user not found');
    }
    selfUser.friends.push(friendUser._id);
    friendUser.friends.push(selfUser._id);
    await selfUser.save();
    await friendUser.save();
    return res.status(202).json({ message: 'Friends added' });
  } catch (err) {
    console.log(err);
  }
};

exports.getRecentChat = async (req, res, next) => {
  try {
    // console.log('...');
    const user = await User.findById(req.userId);
    if (!user) {
      throw new Error('auth error');
    }
    const chats = user.chats;
    const recentChats = [];
    for (const chat of chats) {
      const chatData = await Chat.findById(chat).populate('usersId');
      const userChatInfo = chatData.usersId.find((id) => id.toString() !== req.userId);
      const chatInfo = {
        name: userChatInfo.fullName,
        imageUrl: userChatInfo.config.imageUrl,
        lastMessageText: chatData.messages[chatData.messages.length - 1].messageContnet,
        lastMessageDate: chatData.messages[chatData.messages.length - 1].date,
        chatId: chat._id,
        userId: userChatInfo._id,
      };
      recentChats.push(chatInfo);
    }
    // const usersId = user.chats.map(async (chat) => {
    //   let chatInfo = { name: null, imageUrl: null, lastMessageText: null, lastMessageDate: null };
    //   const chatUserId = chat.usersId.find((id) => id.toString() !== req.userId);
    //   chatInfo.lastMessageText = chat.messages[chat.messages.length - 1].messageContnet;
    //   chatInfo.lastMessageDate = chat.messages[chat.messages.length - 1].date;
    //   return chatInfo;
    // });
    // for (const id of usersId) {
    //   const user = await User.findById(id);
    //   chatInfo.name = user.fullName;
    //   chatInfo.imageUrl = user.config.imageUrl;
    // }
    res.status(202).json({ recentChats: recentChats });
  } catch (err) {
    console.log(err);
  }
};
