import express from "express";
import {
  createExercise,
  getExercises,
  getExercisesByTraining,
  updateExercise,
  deleteExercise
} from "../controllers/mainexercise.controllers.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

// Create
router.post("/create", upload.single("image"), createExercise);


// Get all
router.get("/getallexercises", getExercises);

// Get by trainingId
router.get("/training/:trainingId", getExercisesByTraining);

// Update

router.put("/update/:id", upload.single("image"), updateExercise);
// Delete
router.delete("/delete/:id", deleteExercise);

export default router;
