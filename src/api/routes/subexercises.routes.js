import express from "express";
import {
  createSubExercise,
  getAllSubExercises,
  getSubExerciseById,
  updateSubExercise,
  deleteSubExercise,
} from "../controllers/subexercise.controllers.js";

import { uploadVideo } from "../middleware/upload.js";

const router = express.Router();

// Routes
router.post("/create", uploadVideo.single("video"), createSubExercise);
router.put("/update/:id", uploadVideo.single("video"), updateSubExercise);
router.get("/getall", getAllSubExercises);
router.get("/:id", getSubExerciseById);
router.delete("/delete/:id", deleteSubExercise);

export default router;
