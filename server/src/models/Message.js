const mongoose = require("mongoose");
const messageSchema=new mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    text:{
        type:String
    },
    mediaUrl:{
        type:String
    },
    timestamp:{
        type:Date,
        default:Date.now
    },
    },
    {timestamps:true}
);

module.exports=mongoose.model("Message",messageSchema);