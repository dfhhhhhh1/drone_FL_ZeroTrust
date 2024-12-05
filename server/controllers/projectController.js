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

module.exports = { createProject, getProjectsWithAccess };