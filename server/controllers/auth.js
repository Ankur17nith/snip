const User = requrie('../models/user');

async function handleUserSignIn(req, res){
    const{name,email, password}=req.body;
    await create.User({
        name,
        email,
        password,
    })
}

async function handleUserLogin(req, res){
    const{email, password}=req.body;
    const user= await User.findOne({email, password});
    if(!user) return res.status(401)

    const token = setUser(user);
    res.cookie('token',token)
}