const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    role: {
        type: String,
        enum: ['Admin', 'Editor', 'Viewer', 'Unassigned'],
        required: true
    }
});

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    members: [ memberSchema ],
    unassigned: [ memberSchema ]
});

module.exports = mongoose.model("Project", projectSchema);