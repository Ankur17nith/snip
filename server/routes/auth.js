const {Router}= require("express")
const route = Router();

route.post('/register', handleUserSignIn)
route.post('/login', handleUserLogin)
