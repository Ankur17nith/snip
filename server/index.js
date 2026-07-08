require("dotenv").config({ path: "./server/.env" });
const {checkForAuthentiication}=require('./middlewares/auth')
const express = require("express");
const app = express();
const PORT=process.env.PORT || 8000;
const mongoose= require('mongoose');

const userRouter = require("./routes/auth");
const checkForAuthentication = require("./middlewares/auth");

mongoose.connect(process.env.MONGO_URL)
.then(()=> console.log("MongoDb is connected"))
.catch((err) => console.log('Error', err))

app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(checkForAuthentication)

app.use('/api/auth', userRouter);

app.listen(PORT, ()=> console.log("Server Started at PORT: 8000"))