import SubExercise from "../models/subexercises.model.js";
import fs from "fs";
import path from "path";


export const createSubExercise = async (req, res) => {
  try {
    const { title, description, isLiked, mainExerciseId } = req.body;

    // Check if file uploaded
    if (!req.file) {
      return res.status(400).json({ message: "Video file is required ❌" });
    }

    if (!title || !mainExerciseId) {
      return res.status(400).json({ message: "Title and mainExerciseId are required ❌" });
    }

    const videoPath = `uploads/videos/${req.file.filename}`;

    const newSubExercise = await SubExercise.create({
      title,
      description,
      video: videoPath,
      isLiked: isLiked === true || isLiked === "true" ? true : false,
      mainExerciseId,
    });

    res.status(201).json({ message: "SubExercise created ✅", subExercise: newSubExercise });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error ❌" });
  }
};

// ----------------------
// Get all SubExercises
// ----------------------
export const getAllSubExercises = async (req, res) => {
  try {
    const subExercises = await SubExercise.find().populate("mainExerciseId", "title");
    res.status(200).json({ subExercises });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error ❌" });
  }
};

// ----------------------
// Get single SubExercise
// ----------------------
export const getSubExerciseById = async (req, res) => {
  try {
    const subExercise = await SubExercise.findById(req.params.id).populate("mainExerciseId", "title");
    if (!subExercise) return res.status(404).json({ message: "SubExercise not found ❌" });
    res.status(200).json({ subExercise });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error ❌" });
  }
};

// ----------------------
// Update SubExercise
// ----------------------
export const updateSubExercise = async (req, res) => {
  try {
    const { title, description, isLiked, mainExerciseId } = req.body;

    const subExercise = await SubExercise.findById(req.params.id);
    if (!subExercise) return res.status(404).json({ message: "SubExercise not found ❌" });

    // Update video if new file uploaded
    if (req.file) {
      // Optional: delete old video
      if (subExercise.video && fs.existsSync(subExercise.video)) {
        fs.unlinkSync(subExercise.video);
      }
      subExercise.video = `uploads/videos/${req.file.filename}`;
    }

    subExercise.title = title || subExercise.title;
    subExercise.description = description || subExercise.description;
    subExercise.isLiked = isLiked === true || isLiked === "true" ? true : false;
    subExercise.mainExerciseId = mainExerciseId || subExercise.mainExerciseId;

    await subExercise.save();

    res.status(200).json({ message: "SubExercise updated ✅", subExercise });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error ❌" });
  }
};



export const deleteSubExercise = async (req, res) => {
  try {
    const { id } = req.params;

    const subExercise = await SubExercise.findById(id);
    if (!subExercise) {
      return res.status(404).json({
        success: false,
        message: "SubExercise not found ❌",
      });
    }

    // ✅ absolute video path
    const videoPath = path.join(process.cwd(), subExercise.video);

    // ✅ delete video from folder
    if (fs.existsSync(videoPath)) {
      fs.unlinkSync(videoPath);
    }

    // ✅ delete from DB
    await SubExercise.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "SubExercise & video deleted successfully ✅",
    });
  } catch (error) {
    console.error("DELETE ERROR 👉", error);
    res.status(500).json({
      success: false,
      message: "Server error ❌",
    });
  }
};


