const express = require("express");
const router = express.Router();
const Section = require("../models/section");
const Media = require("../models/media");

// Create a new section
router.post("/sections", async (req, res) => {
  const { name, description } = req.body;

  try {
    // Check if section with the same name already exists
    const existingSection = await Section.findOne({ name });
    if (existingSection) {
      return res.status(400).send({ message: "Section name must be unique" });
    }

    const section = new Section({ name, description });
    await section.save();
    res.status(201).send(section);
  } catch (error) {
    res.status(400).send(error);
  }
});
// Get all sections
router.get("/sections", async (req, res) => {
  try {
    const sections = await Section.find().populate("media");
    res.status(200).send(sections);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get all media of a section by section name
router.get("/sections/name/:name/media", async (req, res) => {
  try {
    const section = await Section.findOne({ name: req.params.name }).populate(
      "media"
    );
    if (!section) {
      return res.status(404).send({ message: "Section not found" });
    }
    res.send(section.media);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Add media to a section
router.post("/sections/:sectionId/media", async (req, res) => {
  const { sectionId } = req.params;
  const { url, name, type } = req.body;

  try {
    const media = new Media({ url, name, type, section: sectionId });
    await media.save();
    const section = await Section.findById(sectionId);
    section.media.push(media._id);
    await section.save();
    res.status(201).send(media);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Update section
router.patch("/sections/:id", async (req, res) => {
  try {
    const section = await Section.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!section) {
      return res.status(404).send();
    }
    res.send(section);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete section
router.delete("/sections/:id", async (req, res) => {
  try {
    const section = await Section.findByIdAndDelete(req.params.id);
    if (!section) {
      return res.status(404).send();
    }
    res.send(section);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update media by ID (URL and name only)
router.patch("/media/:id", async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const media = await Media.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
    if (!media) {
      return res.status(404).send({ message: "Media not found" });
    }
    res.send(media);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete media
router.delete("/media/:id", async (req, res) => {
  try {
    const media = await Media.findByIdAndDelete(req.params.id);
    if (!media) {
      return res.status(404).send();
    }
    await Section.updateOne(
      { _id: media.section },
      { $pull: { media: media._id } }
    );
    res.send(media);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
