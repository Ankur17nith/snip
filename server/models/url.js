const mongoose = require('mongoose');
const user = require("../models/user")

const UrlSchema= new mongoose.Schema({
    originalUrl:{
        type: String,
        required: true,

    },
    shortId:{
        type: String,
        unique: true,
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        type:String,
    },
    clicks:{
        type:Number,
        default: 0
    },
    expiresAt:{
        type:Date,
        required: true,
    },
    clickHistory:[
        {
            timestamps:{
                type: Date,
                default: Date.now(),
            },
            country:{
                type: String,
            },
            city:{
                type: String,
            },

        },
    ]
},{timestamps: true});



const url= mongoose.model('url', UrlSchema);

module.exports= url;