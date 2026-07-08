require("dotenv").config({ path: "./server/.env" });
const jwt = require('jsonwebtoken');

function setUser(user){
    const payload={
        ...user
    };
    return jwt.sign({
        _id: user._id,
        email: user.email,
    }, secret)
}

function getUser(token){
    if(!token) return null;
    try {
        return jwt.verify(token, secret)
    } catch (error) {
        return null;
    }
    
}

module.exports={
    setUser,
    getUser,
}