import mongoose from "mongoose";
const favouriteSchema=new mongoose.Schema({
    userid:{
        type:moongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true    },
        like: {
  type: Boolean,
  default: false
},



})