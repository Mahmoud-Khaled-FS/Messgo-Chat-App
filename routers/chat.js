const express = require('express');

const router = express.Router();
const chatControllers = require('./../controllers/chat');
const isAuth = require('./../middleware/auth');

router.get('/', isAuth, chatControllers.getChat);

router.get('/chat/:userId', isAuth, chatControllers.getChatdb);

router.post('/chat/create-new-chat', isAuth, chatControllers.postCreateNewChat);

router.post('/chat/new-message', isAuth, chatControllers.postCreateNewMessage);

module.exports = router;
