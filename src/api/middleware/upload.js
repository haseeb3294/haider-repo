import multer from "multer";
import path from "path";
import fs from "fs";

// ===============================
// Ensure folders exist
// ===============================
const uploadDir = "uploads";
const videoDir = "uploads/videos";
const imageDir = "uploads/images";

[uploadDir, videoDir, imageDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// ===============================
// DEFAULT STORAGE (images / normal files)
// ===============================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imageDir); // images go here
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// ===============================
// VIDEO STORAGE
// ===============================
const videoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, videoDir); // uploads/videos
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// ===============================
// VIDEO FILTER
// ===============================
const videoFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("video/")) {
    cb(null, true);
  } else {
    cb(new Error("Only video files are allowed ❌"), false);
  }
};

// ===============================
// IMAGE FILTER (for upload)
// ===============================
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed ❌"), false);
  }
};

// ===============================
// EXPORTS (NAMES SAME)
// ===============================
export const uploadVideo = multer({
  storage: videoStorage,
  fileFilter: videoFilter,
});

export const upload = multer({
  storage: storage,
  fileFilter: imageFilter,
});
