const Project = require('../models/Project');
const User = require('../models/User');

const createProject = async (req, res) => {
    const { name, email } = req.body;

    try {
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(400).json({ error: "Invalid user" });
        }

        await Project.create({
            name: name,
            members: [ { user: user._id, role: 'Admin' }]
        });

        return res.status(200).json({ name });
    }
    catch (error) { return res.status(400).json({ error: error.message })};
}

const addUnassignedMember = async(req, res) => {
    let { email, name } = req.body;

    try {
        const project = await Project.findOne({ name });
        const user = await User.findOne({ email });

        if (!project.unassigned.includes({ user: user._id })) {
            project.unassigned.push({ user: user._id, role: 'Unassigned'});
            await project.save();
        }

        return res.status(200).json({ message: "Success" });
    }
    catch (error) { return res.status(400).json({ error: error.message })};
}

const addMember = async(req, res) => {
    let { email, name } = req.body;

    if (!(await isAuthorizedRole(req, name))) {
        return res.status(400).json({ error: "Invalid authorization" });
    }

    try {
        const project = await Project.findOne({ name });
        const user = await User.findOne({ email });

        if (!project.members.includes({ user: user._id })) {
            project.members.push({ user: user._id, role: 'Viewer'});
            project.unassigned.pull({ user: user._id, role: 'Unassigned'});
            await project.save();
        }

        return res.status(200).json({ message: "Success" });
    }
    catch (error) { return res.status(400).json({ error: error.message })};
}

const isAuthorizedRole = async(req, projectName) => {
    if (!req.user) {
        return false;
    }

    const email = req.user.email;

    try {
        const user = await User.findOne({ email: email });
        const project = await Project.findOne({ name: projectName });

        if (project.members.some(member => member.user.equals(user._id) && member.role === "Admin")) {
            return true;
        }

        return false;
    }
    catch (error) { return false; }
}

const getAllMembers = async(req, res) => {
    let { name } = req.query;

    try {
        const project = await Project.findOne({ name });
        const members = {
            current: project.members,
            unassigned: project.unassigned
        }

        const isAdmin = await isAuthorizedRole(req, name);

        return res.status(200).json({ members, isAdmin });
    }
    catch (error) { return res.status(400).json({ error: error.message })};
}

const getProjectsWithAccess = async(req, res) => {
    let { email, index, count } = req.query;

    if (!req.query.hasOwnProperty('index')) {
        index = 0;
    }

    if (!req.query.hasOwnProperty('count')) {
        count = 10;
    }

    try {
        const user = await User.findOne({ email: email });
        const projects = await Project.find().sort({ _id: -1 }).skip(index * count).limit(count);

        const returnProjects = projects.map(project => {
            const hasUser = project.members.some(member => member.user.equals(user._id));

            return {
                name: project.name,
                hasUser
            };
        });
        
        return res.status(200).json({ projects: returnProjects });
    }
    catch (error) { return res.status(400).json({ error: error.message })};
}

module.exports = { createProject, addUnassignedMember, addMember, getAllMembers, getProjectsWithAccess };