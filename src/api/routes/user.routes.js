import express from "express";
import { login, logout, register, updatePersonalInfo, getAllUsers, UpdateProfile,deleteUser } from "../controllers/user.controller.js";
import { isAuthenticated, verifyAdmin } from "../middleware/isAuthenticated.js";

const router = express.Router();

router.route("/register").post(register);

router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/updatePersonalInfo").post(isAuthenticated, updatePersonalInfo);
router.route("/profile/update").post(isAuthenticated, UpdateProfile);
router.get("/getUsers", isAuthenticated, getAllUsers); // optional auth
router.get("/getAllUsers", isAuthenticated, verifyAdmin, getAllUsers);
router.delete("/delete/:id", verifyAdmin, deleteUser);


export default router;