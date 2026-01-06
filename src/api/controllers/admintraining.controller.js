import Training from "../models/admintraining.model.js";
import { upload } from "../middleware/upload.js"; // multer for images
import fs from "fs";
import path from "path";

// ===============================
// CREATE TRAINING (with image upload)
// ===============================
export const createTraining = async (req, res) => {
  try {
    const { title } = req.body;

    // TITLE REQUIRED
    if (!title) {
      return res.status(400).json({ message: "Title is required ❌" });
    }

    // CLEAN TITLE
    const cleanTitle = title.trim().replace(/\s+/g, " ");

    // TITLE VALIDATION
    const titleRegex = /^[A-Za-z0-9 ]+$/;
    if (!titleRegex.test(cleanTitle)) {
      return res.status(400).json({
        message: "Title can contain only letters, numbers, and spaces ❌",
      });
    }

    // DUPLICATE TITLE CHECK
    const existingTraining = await Training.findOne({ title: cleanTitle });
    if (existingTraining) {
      return res.status(400).json({
        message: "Training with this title already exists ❌",
      });
    }

    // IMAGE REQUIRED
    if (!req.file) {
      return res.status(400).json({
        message: "Training image is required ❌",
      });
    }

    // IMAGE TYPE VALIDATION
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        message: "Only JPG, JPEG, and PNG images are allowed ❌",
      });
    }

    // IMAGE PATH
    const trainingImage = path.join("uploads/images", req.file.filename);

    // CREATE TRAINING
    const training = await Training.create({
      title: cleanTitle,
      trainingImage,
    });

    res.status(201).json({
      success: true,
      message: "Training created successfully ✅",
      training,
    });
  } catch (error) {
    console.error("CREATE TRAINING ERROR 👉", error);
    res.status(500).json({ message: "Internal server error ❌" });
  }
};

// ===============================
// GET ALL TRAININGS
// ===============================
export const getAllTrainings = async (req, res) => {
  try {
    const trainings = await Training.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      trainings,
    });
  } catch (error) {
    console.error("GET TRAININGS ERROR 👉", error);
    res.status(500).json({ message: "Internal server error ❌" });
  }
};

// ===============================
// UPDATE TRAINING (with optional new image)
// ===============================
export const updateTraining = async (req, res) => {
  try {
    const { id } = req.params;
    const training = await Training.findById(id);

    if (!training) {
      return res.status(404).json({ message: "Training not found ❌" });
    }

    if (!req.body.title && !req.file) {
      return res.status(400).json({ message: "Nothing to update ❌" });
    }

    // TITLE UPDATE
    if (req.body.title) {
      const cleanTitle = req.body.title.trim().replace(/\s+/g, " ");
      const titleRegex = /^[A-Za-z0-9 ]+$/;

      if (!titleRegex.test(cleanTitle)) {
        return res.status(400).json({
          message: "Title can contain only letters, numbers, and spaces ❌",
        });
      }

      // DUPLICATE TITLE CHECK
      const duplicate = await Training.findOne({
        title: cleanTitle,
        _id: { $ne: id },
      });

      if (duplicate) {
        return res.status(400).json({
          message: "Training with this title already exists ❌",
        });
      }

      training.title = cleanTitle;
    }

    // IMAGE UPDATE
    if (req.file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedTypes.includes(req.file.mimetype)) {
        return res.status(400).json({
          message: "Only JPG, JPEG, and PNG images are allowed ❌",
        });
      }

      const maxSize = 2 * 1024 * 1024; // 2MB
      if (req.file.size > maxSize) {
        return res.status(400).json({
          message: "Image size must be less than 2MB ❌",
        });
      }

      // Delete old image if exists
      if (training.trainingImage && fs.existsSync(training.trainingImage)) {
        fs.unlinkSync(training.trainingImage);
      }

      training.trainingImage = path.join("uploads/images", req.file.filename);
    }

    await training.save();

    res.status(200).json({
      success: true,
      message: "Training updated successfully ✅",
      training,
    });
  } catch (err) {
    console.error("UPDATE TRAINING ERROR 👉", err);
    res.status(500).json({ message: "Internal server error ❌" });
  }
};

// ===============================
// DELETE TRAINING
// ===============================
export const deleteTraining = async (req, res) => {
  try {
    const training = await Training.findByIdAndDelete(req.params.id);

    if (!training) {
      return res.status(404).json({ message: "Training not found ❌" });
    }

    // Delete image file
    if (training.trainingImage && fs.existsSync(training.trainingImage)) {
      fs.unlinkSync(training.trainingImage);
    }

    res.status(200).json({
      success: true,
      message: "Training deleted successfully ✅",
    });
  } catch (error) {
    console.error("DELETE TRAINING ERROR 👉", error);
    res.status(500).json({ message: "Internal server error ❌" });
  }
};
