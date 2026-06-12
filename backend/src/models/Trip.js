const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
    {
        title:{
            type:String,
            required:true,
            trim:true,
        },
        description:{
            type:String,
            default:"",
        },
        owner:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        },
        members:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"User",
            },
        ],
        coverImage:{
            type:String,
            default:null,
        },
        aiStory:{
            type:String,
            default:null,
        },
    },
    {
        timestamps:true,
    }
);

module.exports = mongoose.model("Trip",tripSchema);