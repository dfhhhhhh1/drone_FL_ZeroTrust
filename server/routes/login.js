const express = require('express');
const authenticator = require('../middleware/authenticate');
const loginController = require('../controllers/loginController');

const router = express.Router();

router.post('./', loginController.loginUser);
router.get('./info', authenticator.authenticateToken, loginController.getUserInfo);
router.get('./logout', loginController.logoutUser);

module.exports = router;