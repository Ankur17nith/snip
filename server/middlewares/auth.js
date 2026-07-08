const { getUser } = require("../utils/generateToken");

function checkForAuthentication(req, res, next) {
    const token = req.cookies?.token;
    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }

    const user = getUser(token);
    if (!user) {
        return res.status(401).json({ message: "Not authorized, token invalid" });
    }

    req.user = user;
    return next();
}

module.exports = checkForAuthentication;