import express from "express";
import { protect, authorize } from "../middleware/auth";
import {
  createComplaint,
  getComplaints,
  updateComplaint,
  getComplaintStats,
} from "../controllers/complaintController";
import { validateRequest } from "../middleware/validateRequest";
import { complaintSchema } from "../validators/complaintValidator";

const router = express.Router();

router.post("/", validateRequest(complaintSchema), createComplaint);
router.get("/", protect, getComplaints);
router.get("/stats", protect, getComplaintStats);
router.put("/:id", protect, authorize("admin"), updateComplaint);

export default router;
