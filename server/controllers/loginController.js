require('dotenv').config();
const User = require('../models/User');
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const generateToken = (email) => {
    return jwt.sign(
        { email: email },
        process.env.JWT_KEY,
        { expiresIn: "1d" }
    );
}

const addCookie = (res, email) => {
    res.cookie("authToken", generateToken(email), {
        httpOnly: true,
        secure:  false, // True in production
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000
    });
}

const validateToken = async (req, res) => {
    res.status(200).json({ valid: true });
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email: req.body.email });

    // Verifies the user exists and the entered email/pass combination is valid.
    if (user) {
        if (await bcrypt.compare(password, user.password)) {
            res.clearCookie("authToken");
            addCookie(res, email);
            
            return res.status(200).json({ message: "Success" });
        }
    }
    return res.status(400).json({ error: "Invalid email or password" });
}

const getUserInfo = async (req, res) => {
    const { email, password } = req.body;

    res.status(200).json({ message: "Validated" });
}

const logoutUser = async (req, res) => {
    res.clearCookie("authToken");
    res.status(200).json({});
}

const registerUser = async (req, res) => { 
    const { email, password } = req.body;

    try {
        await User.create({
            email, password
        });

        res.clearCookie("authToken");
        addCookie(res, email);

        return res.status(200).json({ message: "Success" });
    }
    catch (error) { return res.status(400).json({ error: error.message })};
}

module.exports = { generateToken, validateToken, loginUser, getUserInfo, logoutUser, registerUser };