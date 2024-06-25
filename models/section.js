const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  media: [{ type: mongoose.Schema.Types.ObjectId, ref: "Media" }],
});

module.exports = mongoose.model("Section", sectionSchema);
