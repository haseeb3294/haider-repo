import moongoose from "moongoose";
const communitySchema= new moongoose.Schema({
      description:{
        type:String,
        required:true
      },
      communityImage:{
        type:String,
        default:""
      },
    like: {
  type: Boolean,
  default: false
},
userId:{
    type:moongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
},






});
export const  Community=moongoose.model("Community",communitySchema) 