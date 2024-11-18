const express = require('express');
const authenticator = require('../middleware/authenticate');
const loginController = require('../controllers/loginController');

const router = express.Router();

router.post('/', loginController.loginUser);
router.get('/validate', authenticator.authenticateToken, loginController.validateToken);
router.get('/info', authenticator.authenticateToken, loginController.getUserInfo);
router.get('/logout', loginController.logoutUser);

router.post('/register', loginController.registerUser);
router.post('/two-factor', loginController.validate2FA);

module.exports = router;