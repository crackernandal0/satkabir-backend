const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { protect, admin } = require("../middlewares/authMiddleware");
const Image = require("../models/imageModel");

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer (without storage destination since we are not storing locally)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload image route
router.post("/upload", upload.single("image"), async (req, res) => {
  const { type } = req.body;
  try {
    // Upload image to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ resource_type: "image" }, (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        })
        .end(req.file.buffer);
    });

    // Check if result.secure_url exists
    if (!result.secure_url) {
      throw new Error("Failed to upload image to Cloudinary");
    }

    // Save image info in database
    const image = await Image.create({
      type,
      imageUrl: result.secure_url,
    });

    // Respond with image info
    res.status(201).json(image);
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
