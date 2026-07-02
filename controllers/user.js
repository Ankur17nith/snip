const {v4:uuid}= require("uuid")
const User= require("../models/users")
const {setUser, getUser}= require("../services/auth")

async function handleUserSignUp(req, res){
    const {name, email, password}= req.body;
    await User.create({
        name,
        email,
        password,
    });
    return res.redirect("/");
}

async function handleUserLogin(req, res){
    const{email, password}=req.body;
    const user=await User.findOne({email, password});
    if(!user)
        return res.render("login",{
          error: "Invalid Email or Password",
        })
    const sessionId= uuid();
    setUser(sessionId, user);
    res.cookie('uid',sessionId)
    return res.redirect("/");
}

module.exports={
    handleUserSignUp,
    handleUserLogin
}