require('dotenv').config();
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.cookies.authToken;
    if (token == null) {
        return res.status(401).json({ message: "Must be authenticated" });
    }

    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid authentication" });
        }

        req.user = decoded;
        next();
    })
}

module.exports = { authenticateToken };