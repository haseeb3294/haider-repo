const User = require("../model/user")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    let { fullname, email, password } = req.body;

    //Required fields
    if (!fullname || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    //Fullname validation
    fullname = fullname.trim().replace(/\s+/g, " ");
    const nameRegex = /^[A-Za-z]+( [A-Za-z]+)*$/;
    if (!nameRegex.test(fullname)) {
      return res.status(400).json({
        message: "Full name must contain only letters and spaces",
        success: false,
      });
    }

    // Email validation (Gmail only)
    email = email.trim().toLowerCase();
    const gmailRegex = /^[A-Za-z0-9._%+-]+@gmail\.com$/;
    if (!gmailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format. Only Gmail is allowed.",
        success: false,
      });
    }

    // Check duplicate email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email",
        success: false,
      });
    }

    //Password validation (min 10 characters)
    if (password.length < 10) {
      return res.status(400).json({
        message: "Password must be at least 10 characters long",
        success: false
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //Create user
    await User.create({
      fullname,
      email,
      password: hashedPassword,
       is_admin: req.body.is_admin || false
    });

    // Success response
    return res.status(201).json({
      message: "User registered successfully",
      success: true,
    });

  } catch (error) {
    console.error("REGISTER ERROR 👉", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};


const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(req.body);

    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
        success: false,
      });
    }

    const token = jwt.sign(
      { userId: user._id, is_admin: user.is_admin },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "lax",
      secure: false,
    });

    return res.status(200).json({
      message: `Welcome ${user.fullname}`,
      success: true,
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        is_admin: user.is_admin,
      },
    });

  } catch (err) {
    console.error("LOGIN ERROR 👉", err);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};



const logout = async (req, res) => {
  try {
    return res.status(200)
      .cookie("token", "", { maxAge: 0, httpOnly: true, sameSite: "lax" })
      .json({
        message: "Logout successfully",
        success: true
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false
    }); 
  } 
};
const updatePersonalInfo= async (req, res) => {
  try {
    const {  gender, age, weight, address } = req.body;
    const userId = req.id;

    // Find user
    let user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found", success: false });
    }

    // Update fields if provided
    if (gender) user.gender = gender;
    if (age) user.age = age;
    if (weight) user.weight = weight;
    if (address) user.address = address;

    // Save updated user
    await user.save();

    // Return response
    return res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        gender: user.gender || null,
        age: user.age || null,
        weight: user.weight || null,
        address: user.address || "",
      }
    });

  } catch (error) {
    console.error("UPDATE PROFILE ERROR 👉", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};



const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // password hide
    return res.status(200).json(users);
  } catch (error) {
    console.error("GET USERS ERROR 👉", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};
const UpdateProfile = async (req, res) => {
  try {
    const { userId, fullname, email, gender, age, weight, address } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    // Fullname validation (letters and spaces only)
    if (fullname) {
      const nameRegex = /^[A-Za-z]+( [A-Za-z]+)*$/;
      if (!nameRegex.test(fullname.trim())) {
        return res.status(400).json({
          message: "Full name must contain only letters and spaces",
          success: false,
        });
      }
      user.fullname = fullname.trim().replace(/\s+/g, " ");
    }

    // Email validation (standard Gmail)
    if (email) {
      const trimmedEmail = email.trim().toLowerCase();
      const gmailRegex = /^[A-Za-z0-9._%+-]+@gmail\.com$/;
      if (!gmailRegex.test(trimmedEmail)) {
        return res.status(400).json({
          message: "Invalid email format. Only Gmail is allowed.",
          success: false,
        });
      }
      user.email = trimmedEmail;
    }

    if (gender) user.gender = gender;
    if (age) user.age = Number(age);
    if (weight) user.weight = Number(weight);
    if (address) user.address = address.trim();

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      user,
    });
  } catch (error) {
    console.error("UPDATE ERROR 👉", error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};



const deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted successfully" });
};


module.exports = {
  register,
  userLogin,
  logout,
  UpdateProfile,
  deleteUser,
  getAllUsers
};
