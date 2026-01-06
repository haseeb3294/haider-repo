import UserTraining from "../models/usertraining.models.js";


export const selectTraining = async (req, res) => {
  try {
    const userId = req.user.id;
    const { trainingId } = req.body;

    if (!trainingId) {
      return res.status(400).json({ message: "Training ID required" });
    }

    let selection = await UserTraining.findOne({ userId });

    if (selection) {
      selection.trainingId = trainingId;
      await selection.save();
    } else {
      selection = await UserTraining.create({ userId, trainingId });
    }

    // ✅ Correct populate
    const populatedSelection = await UserTraining.findById(selection._id)
      .populate("userId", "_id fullname email")
      .populate("trainingId", "_id title trainingImage");

    return res.status(200).json({
      message: "Training selected successfully ✅",
      selection: populatedSelection,
    });
  } catch (err) {
    console.error("SELECT TRAINING ERROR 👉", err);
    return res.status(500).json({ message: "Server error" });
  }
};


export const getMyTraining = async (req, res) => {
  try {
    const userId = req.user.id;

    const userTraining = await UserTraining.findOne({ userId })
      .populate("trainingId")
      .populate("userId", "_id fullname email");

    if (!userTraining) {
      return res.status(404).json({ message: "No training selected" });
    }

    res.status(200).json({ training: userTraining.trainingId, user: userTraining.userId });
  } catch (err) {
    console.error("GET MY TRAINING ERROR 👉", err);
    res.status(500).json({ message: "Server error" });
  }
};

// --------------------
// Get all selections (admin only)
// --------------------
export const getAllSelections = async (req, res) => {
  try {
    const selections = await UserTraining.find()
      .populate("userId", "_id fullname email")
      .populate("trainingId", "_id title trainingImage");

    res.status(200).json(selections);
  } catch (err) {
    console.error("GET ALL SELECTIONS ERROR 👉", err);
    res.status(500).json({ message: "Server error" });
  }
};

// --------------------
// Get selections for a specific user (admin can pass userId)
// --------------------
export const getUserSelections = async (req, res) => {
  try {
    // Admin can query ?userId=xxxx, otherwise default to logged-in user
    const userId = req.query.userId || req.user.id;

    const selections = await UserTraining.find({ userId })
      .populate("trainingId", "_id title trainingImage")
      .populate("userId", "_id fullname email");

    return res.status(200).json({
      success: true,
      selections,
    });
  } catch (err) {
    console.error("GET USER SELECTIONS ERROR 👉", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
