const { getUser}= require("../services/auth")

function checkForAuthentiication(req, res, next){
    const token = req.cookie?.token;
    req.user=null;
    if(!token)
        return next();


    const user=getUser(token);

    req.user= user;
    return next();
}

function restrictTo(roles= []){
    return function(req, res, next){
        if(!req.user) return res.redirect("/login");

        if(!roles.includes(req.user.role)) return res.end('UnAuthorized');

        return next();
    }
}

module.exports= {
    checkForAuthentiication,
    restrictTo
}