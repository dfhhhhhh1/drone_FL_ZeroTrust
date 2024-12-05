const express = require('express');
const authenticator = require('../middleware/authenticate');
const emailNotificationController = require('../controllers/emailNotificationController');

const router = express.Router();

router.post('/', emailNotificationController.sendEmail);



module.exports = router;