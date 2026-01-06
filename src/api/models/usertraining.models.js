import mongoose from "mongoose";

const userTrainingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    trainingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Training",
      required: true,
    },

  },
  { timestamps: true }
);

userTrainingSchema.index(
  { userId: 1, trainingId: 1 },
  { unique: true }
);

export default mongoose.model("UserTraining", userTrainingSchema);
