const express = require('express');
const router = express.Router();

const isAuth = require('../middleware/isAuth');

const chatController = require('../controllers/chatController');

router.get('/urContact', isAuth, chatController.getUrContact)

router.post('/send', isAuth, chatController.sendMessage)

module.exports = router; 