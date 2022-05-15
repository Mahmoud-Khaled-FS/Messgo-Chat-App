const express = require('express');

const router = express.Router();
const userControllers = require('../controllers/user');
const isAuth = require('../middleware/auth');

// router.get('/friends', isAuth, userControllers.getFriends);

router.get('/friends', isAuth, userControllers.getFriends);
router.get('/myid', isAuth, userControllers.getId);
router.get('/user/recent-chat', isAuth, userControllers.getRecentChat);

router.post('/search/user', isAuth, userControllers.postUsersSearch);

router.post('/user/addfriend', isAuth, userControllers.postAddUser);

module.exports = router;
