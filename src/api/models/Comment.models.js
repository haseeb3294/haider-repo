import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  communityid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Community",
    required: true,
  },
});

export default mongoose.model("Comment", commentSchema);
