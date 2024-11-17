const jwt = require("jsonwebtoken");

const SECRET_KEY = "waka";

const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, username: user.username },
        SECRET_KEY,
        { expiresIn: "1d" }
    );
}

const loginUser = async (req, res) => {
    const { username, password } = req.body;

    const token = generateToken(user);

    res.cookie("authToken", token, {
        httpOnly: true,
        secure:  true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000
    });

    res.status(200).json({});
}

const getUserInfo = async (req, res) => {
    const { username, password } = req.body;

    res.status(200).json({ message: "Validated" });
}

const logoutUser = async (req, res) => {
    res.clearCookie("authToken");
    res.status(200).json({});
}

module.exports = { generateToken, loginUser, getUserInfo, logoutUser };