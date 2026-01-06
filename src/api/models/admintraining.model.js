import mongoose from "mongoose";

const trainingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  trainingImage: {
    type: String,
    default: "",
  },
});

export default mongoose.model("Training", trainingSchema);
