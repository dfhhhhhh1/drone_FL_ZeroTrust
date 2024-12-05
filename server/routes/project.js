const express = require('express');
const authenticator = require('../middleware/authenticate');
const projectController = require('../controllers/projectController');

const router = express.Router();

router.post('/create', authenticator.authenticateToken, projectController.createProject);
// email: new user, name: name of project
router.post('/addUnassigned', authenticator.authenticateToken, projectController.addUnassignedMember);
// email: new user, name: name of project
router.post('/addMember', authenticator.authenticateToken, projectController.addMember);
// name: project name
// members: current: [], unassigned: []     isAdmin: bool for current admin
router.get('/members/:name', authenticator.authenticateToken, projectController.getAllMembers);
// email: user's email, index: index of page, count: number of entries
// projects: [ name: project's name, hasUser: if user is in project ]
router.get('/listWithAccess', authenticator.authenticateToken, projectController.getProjectsWithAccess);

module.exports = router;