import mongoose from "mongoose";

const subExerciseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    video: { type: String, required: true },
    isLiked: { type: Boolean, default: false },
    mainExerciseId: { type: mongoose.Schema.Types.ObjectId, ref: "Exercise", required: true },
  },
  { timestamps: true }
);

const SubExercise = mongoose.model("SubExercise", subExerciseSchema);
export default SubExercise;
