const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");

// POST /api/complaints
router.post("/", async (req, res) => {
  const { category, description, email } = req.body;

  // Validation
  if (!category || !description || !email) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!email.includes("@")) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    const complaint = new Complaint({ category, description, email });
    await complaint.save();
    res
      .status(201)
      .json({ message: "Complaint submitted successfully", complaint });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error submitting complaint", error: error.message });
  }
});

module.exports = router;
