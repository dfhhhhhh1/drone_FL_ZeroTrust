require('dotenv').config();
const User = require('../models/User');
const LoginToken = require('../models/LoginToken');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const speakeasy = require("speakeasy");
const crypto = require('crypto');

const generateLoginToken = async (req, user) => {
    const loginToken = crypto.randomBytes(32).toString('hex');

    try {
        await LoginToken.findOneAndDelete({ userId: user._id });
    }
    catch (error) { };

    const log = await LoginToken.create({
        token: loginToken,
        userId: user._id,
        ip: req.ip
    });

    return jwt.sign(
        { loginToken: loginToken },
        process.env.JWT_KEY,
        { expiresIn: "5m" }
    );
}

const addLoginCookie = async (res, req, user) => {
    res.cookie("loginToken", await generateLoginToken(req, user), {
        httpOnly: true,
        secure:  false, // True in production
        sameSite: "strict",
        maxAge: 5 * 60 * 1000
    });
}

const validateLoginToken = async (req, user) => {
    const loginTokenCookie = req.cookies.loginToken;

    if (loginTokenCookie == null) {
        return false;
    }

    const loginToken = jwt.verify(loginTokenCookie, process.env.JWT_KEY);
    if (loginToken == null) {
        return false;
    }

    const token = await LoginToken.findOne({
        token: loginToken.loginToken,
        userId: user._id,
        ip: req.ip,
    });

    if (token) {
        await LoginToken.findByIdAndDelete(token._id);
        return true;
    }

    return false;
}

const generateToken = (email) => {
    return jwt.sign(
        { email: email },
        process.env.JWT_KEY,
        { expiresIn: "1d" }
    );
}

const addAuthCookie = (res, email) => {
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

const validate2FA = async (req, res) => {
    const { email, otpToken } = req.body;

    const user = await User.findOne({ email: email });

    if (otpToken && user) {
        const totpVerified = await speakeasy.totp.verify({
            secret: user.otpkey,
            encoding: 'base32',
            token: otpToken
        });

        console.log("HELLO");

        if (totpVerified) {
            const loginValidated = await validateLoginToken(req, user);

            console.log("HI");
            if (loginValidated) {
                console.log("WAA");
                res.clearCookie("loginToken");
                res.clearCookie("authToken");
                addAuthCookie(res, email);
    
                return res.status(200).json({ message: "Success" });
            }
        }
    }
    return res.status(400).json({ error: "Invalid email or token" });
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });

    try { // Verifies the user exists and the entered email/pass combination is valid.
        if (user) {
            if (await bcrypt.compare(password, user.password)) {
                res.clearCookie("loginToken");
                await addLoginCookie(res, req, user);
                
                return res.status(200).json({ message: "Success" });
            }
        }

        return res.status(400).json({ error: "Invalid email or password" });

    }
    catch (error) { res.status(400).json({ error: "Invalid email or password" }); }
}

const getUserInfo = async (req, res) => {
    res.status(200).json({ email: req.user.email });
}

const logoutUser = async (req, res) => {
    res.clearCookie("authToken");
    res.status(200).json({});
}

const registerUser = async (req, res) => { 
    const { email, password } = req.body;

    try {
        const otpSecret = speakeasy.generateSecret({
            length: 20,
            name: "FL Model",
        });

        await User.create({
            email, password, otpkey: otpSecret.base32
        });

        return res.status(200).json({ qrcode: otpSecret.otpauth_url });
    }
    catch (error) { return res.status(400).json({ error: error.message })};
}

module.exports = { generateToken, validateToken, validate2FA, loginUser, getUserInfo, logoutUser, registerUser };