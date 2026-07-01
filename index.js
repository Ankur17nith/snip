const express=require('express');
const path=require('path')
const urlRoute=require('./routes/url')
const URL= require('./models/url')
const {connectToMongoDb}=require('./connect')
const staticRoute = require("./routes/staticRouter")
const app=express();
const PORT=7000;

connectToMongoDb('mongodb://127.0.0.1:27017/short-url')
.then(()=>console.log("Connect to MongoDb"))

app.set("view engine", "ejs")
app.set('views', path.resolve("./views"))

app.use(express.json());
app.use(express.urlencoded({extended: false}))

app.use('/url',urlRoute)
app.use('/', staticRoute)



app.listen(PORT,()=> console.log("Server Started "))
