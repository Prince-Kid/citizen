import { Complaint } from "../models/Complaint";
import { logger } from "../utils/logger";

export const seedComplaints = async (users: any[], departments: any[]) => {
  try {
    // Clear existing complaints
    await Complaint.deleteMany({});
    logger.info("Cleared existing complaints");

    const citizens = users.filter((user) => user.role === "citizen");
    const publicWorks = departments.find(
      (dept) => dept.name === "Public Works"
    );
    const environmental = departments.find(
      (dept) => dept.name === "Environmental Services"
    );
    const safety = departments.find((dept) => dept.name === "Public Safety");

    const complaints = [
      {
        title: "Pothole on Main Street",
        description:
          "Large pothole causing traffic issues and potential damage to vehicles",
        category: "Road Maintenance",
        status: "pending",
        location: {
          type: "Point",
          coordinates: [-73.935242, 40.73061],
        },
        submittedBy: citizens[0]._id,
        department: publicWorks._id,
        priority: "high",
      },
      {
        title: "Broken Street Light",
        description:
          "Street light not working for the past week, making the area unsafe at night",
        category: "Street Lighting",
        status: "in_progress",
        location: {
          type: "Point",
          coordinates: [-73.935242, 40.73061],
        },
        submittedBy: citizens[1]._id,
        department: publicWorks._id,
        priority: "medium",
      },
      {
        title: "Illegal Dumping",
        description: "People dumping garbage in the park after hours",
        category: "Waste Management",
        status: "pending",
        location: {
          type: "Point",
          coordinates: [-73.935242, 40.73061],
        },
        submittedBy: citizens[0]._id,
        department: environmental._id,
        priority: "high",
      },
      {
        title: "Traffic Light Malfunction",
        description: "Traffic light at intersection not working properly",
        category: "Traffic Management",
        status: "resolved",
        location: {
          type: "Point",
          coordinates: [-73.935242, 40.73061],
        },
        submittedBy: citizens[1]._id,
        department: safety._id,
        priority: "high",
        resolution:
          "Traffic light has been repaired and is now functioning normally",
      },
    ];

    const createdComplaints = await Complaint.insertMany(complaints);
    logger.info(`Created ${createdComplaints.length} complaints`);

    return createdComplaints;
  } catch (error) {
    logger.error("Error seeding complaints:", error);
    throw error;
  }
};
