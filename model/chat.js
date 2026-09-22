const mongoose = require('mongoose');

const chatSchemac = new mongoose.Schema({

    from:{
        type:String
    },
    to:{
        type:String
    },
    message:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});

const chat = mongoose.model('chat',chatSchemac);
module.exports = chat;