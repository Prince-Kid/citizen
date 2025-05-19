const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");

// GET /api/admin/complaints
router.get("/complaints", async (req, res) => {
  try {
    const complaints = await Complaint.find();
    res.json(complaints);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching complaints", error: error.message });
  }
});

// PUT /api/admin/complaints/:id
router.put("/complaints/:id", async (req, res) => {
  const { id } = req.params;
  const { status, response } = req.body;
  try {
    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    complaint.status = status;
    complaint.response = response;
    await complaint.save();
    res.json({ message: "Complaint updated successfully", complaint });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating complaint", error: error.message });
  }
});

module.exports = router;
