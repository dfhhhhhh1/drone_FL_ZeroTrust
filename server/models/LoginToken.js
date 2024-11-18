const mongoose = require('mongoose');

const loginTokenSchema = new mongoose.Schema({
    token: { 
        type: String,
        required: true 
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    ip: { 
        type: String, 
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now, 
        expires: 300 
    }
});

module.exports = mongoose.model("LoginToken", loginTokenSchema);