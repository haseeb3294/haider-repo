const express = require("express");
const { userLogin, logout, register, updatePersonalInfo, getAllUsers, UpdateProfile,deleteUser } = require("../controller/userController")


const router = express.Router();


router.post("/login", userLogin)
router.route("/register").post(register);

router.route("/logout").get(logout);



module.exports =  router;