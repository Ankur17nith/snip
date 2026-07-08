const {getUser}= require("../utils/generateToken")

function checkForAuthentication(req, res, next){
    const token = req.cookie?.token;
    if(!token) return res.status(401,()=> console.log("Not authorized, no token"))

    const user=getUser(token);
    if(!user) return res.status(401,()=>"Not authorized, token invalid")
    req.user= user;
    return next();
}

module.exports= checkForAuthentication;