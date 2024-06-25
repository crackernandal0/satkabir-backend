const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  type: { type: String, required: true }, // home, about, gallery
  imageUrl: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

const Image = mongoose.model("Image", imageSchema);
module.exports = Image;
