import { Request, Response } from "express";
import { Complaint } from "../models/Complaint";
import { logger } from "../utils/logger";

export const createComplaint = async (req: Request, res: Response) => {
  try {
    const { category, description, email } = req.body;

    const complaint = await Complaint.create({
      category,
      description,
      email,
    });

    res.status(201).json({
      message: "Complaint submitted successfully",
      complaint,
    });
  } catch (error) {
    logger.error("Error in createComplaint:", error);
    res.status(500).json({ message: "Error submitting complaint" });
  }
};

export const getComplaints = async (req: Request, res: Response) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    logger.error("Error in getComplaints:", error);
    res.status(500).json({ message: "Error fetching complaints" });
  }
};

export const updateComplaint = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, response } = req.body;

    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    complaint.status = status;
    if (response) {
      complaint.response = response;
    }

    await complaint.save();

    res.json({
      message: "Complaint updated successfully",
      complaint,
    });
  } catch (error) {
    logger.error("Error in updateComplaint:", error);
    res.status(500).json({ message: "Error updating complaint" });
  }
};

export const getComplaintStats = async (req: Request, res: Response) => {
  try {
    const stats = await Complaint.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const formattedStats = stats.reduce((acc: any, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    res.json(formattedStats);
  } catch (error) {
    logger.error("Error in getComplaintStats:", error);
    res.status(500).json({ message: "Error fetching complaint statistics" });
  }
};
