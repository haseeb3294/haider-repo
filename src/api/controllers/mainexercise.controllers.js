import { Exercise } from "../models/mainexercise.model.js";

export const createExercise = async (req, res) => {
  try {
    const { trainingId, title } = req.body;
    const image = req.file ? `uploads/images/${req.file.filename}` : "";

    if (!trainingId || !title) {
      return res.status(400).json({ 
        message: "Training ID and Title are required", 
        success: false 
      });
    }

    if (!image) {
      return res.status(400).json({ 
        message: "Exercise image is required", 
        success: false 
      });
    }

    const exercise = new Exercise({ 
      trainingId, 
      title, 
      image: image 
    });
    await exercise.save();

    res.status(201).json({ 
      message: "Exercise created successfully", 
      success: true, 
      exercise 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: "Internal server error", 
      success: false 
    });
  }
};

// Get all exercises
export const getExercises = async (req, res) => {
  try {
    const exercises = await Exercise.find().populate("trainingId", "title"); 
    res.status(200).json(exercises);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// Get exercises by trainingId
export const getExercisesByTraining = async (req, res) => {
  try {
    const { trainingId } = req.params;
    const exercises = await Exercise.find({ trainingId });
    res.status(200).json(exercises);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// Update exercise


export const updateExercise = async (req, res) => {
  try {
    const { id } = req.params; // The exercise _id from URL
    const { title } = req.body;

    // Build the update object dynamically
    const updateData = {};
    if (title) updateData.title = title; // Update title if provided
    if (req.file) updateData.image = `uploads/images/${req.file.filename}`; // Update image if file uploaded

    // Check if anything to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        message: "Nothing to update. Provide title or image.",
        success: false,      
      });
    }

    // Update the exercise
    const exercise = await Exercise.findByIdAndUpdate(id, updateData, { new: true });

    if (!exercise) {
      return res.status(404).json({
        message: "Exercise not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Exercise updated successfully ✅",
      success: true,
      exercise,
    });
  } catch (error) {
    console.error("UPDATE EXERCISE ERROR 👉", error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};



// Delete exercise
export const deleteExercise = async (req, res) => {
  try {
    const { id } = req.params;

    const exercise = await Exercise.findByIdAndDelete(id);

    if (!exercise) {
      return res.status(404).json({ message: "Exercise not found", success: false });
    }

    res.status(200).json({ message: "Exercise deleted", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};
