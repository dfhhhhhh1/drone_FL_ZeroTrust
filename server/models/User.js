require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String, 
        required: [true, 'This field is required'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email'],
        trim: true,
        unique: true,
    }, 
    password: {
        type: String, 
        required: [true, 'This field is required'],
        trim: true,
        minLength: [8, 'Password must be at least 8 characters'],
        maxLength: [16, 'Password cannot exceed 16 characters'],
    }, 
})

// Runs after validation, but before creation. 
// Salts and hashes the newly-created password.
userSchema.pre('save', function(next) {
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync());
    
    next();
})

module.exports = mongoose.model("User", userSchema);