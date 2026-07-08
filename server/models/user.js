const bcrypt = require("bcryptjs") ;
const mongoose = require('mongoose');

const UserSchema= new mongoose.Schema({
    name:{
        type: String,
        required: true,

    },
    email:{
        type: String,
        unique: true,
        required: true,
    },
    password:{
        type:String,
        required: true,
    },
},{timestamps: true});

UserSchema.pre("save", async function (next){
    if(!this.isModified("password")) return ;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);


})

UserSchema.methods.comparePassword = async function (candidatePassword){
    return bcrypt.compare(candidatePassword, this.password);
}

const user= mongoose.model('user', UserSchema);

module.exports= user;