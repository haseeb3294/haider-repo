import mongoose from "mongoose";
const categorySchema=new mongoose.Schema({
    level:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
   
        exercises: 
        [{ type: String }] ,
        categoryImage:{
            type:String,
            default:"",
        }
 
});
export default moongoose.model("Category",categorySchema)