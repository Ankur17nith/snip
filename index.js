const express=require('express');
const path=require('path')
const cookieParser =require("cookie-parser")
const URL= require('./models/url')
const {connectToMongoDb}=require('./connect')
const {restrictTo, checkForAuthentiication}=require("./middleware/auth")
const app=express();
const PORT=7000;

//Routes
const urlRoute=require('./routes/url')
const staticRoute = require("./routes/staticRouter")
const userRoute =require("./routes/user")

connectToMongoDb('mongodb://127.0.0.1:27017/short-url')
.then(()=>console.log("Connect to MongoDb"))

app.set("view engine", "ejs")
app.set('views', path.resolve("./views"))

app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(checkForAuthentiication)

app.use('/url',restrictTo("NORMAL"), urlRoute)
app.use('/', staticRoute)
app.use("/user", userRoute);



app.listen(PORT,()=> console.log("Server Started "))
