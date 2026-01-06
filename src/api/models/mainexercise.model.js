import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema({
  trainingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Training",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "",
   
  }
}, { timestamps: true });

export const Exercise = mongoose.model("Exercise", exerciseSchema);
