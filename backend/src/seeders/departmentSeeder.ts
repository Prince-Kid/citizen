import { Department } from "../models/Department";
import { User } from "../models/User";
import { logger } from "../utils/logger";

export const seedDepartments = async () => {
  try {
    // Check if departments already exist
    const count = await Department.countDocuments();
    if (count > 0) {
      logger.info("Departments already seeded");
      return;
    }

    // Get department head
    const deptHead = await User.findOne({ role: "department_head" });
    if (!deptHead) {
      throw new Error("Department head not found. Please seed users first.");
    }

    const departments = [
      {
        name: "Public Works",
        description: "Handles infrastructure and public facilities",
        head: deptHead._id,
        contactEmail: "publicworks@example.com",
        contactPhone: "123-456-7890",
        address: "123 Main St, City",
        categories: ["Roads", "Bridges", "Public Buildings"],
      },
      {
        name: "Environmental Services",
        description: "Manages environmental protection and waste management",
        head: deptHead._id,
        contactEmail: "environment@example.com",
        contactPhone: "123-456-7891",
        address: "456 Green St, City",
        categories: [
          "Waste Management",
          "Recycling",
          "Environmental Protection",
        ],
      },
    ];

    await Department.insertMany(departments);
    logger.info("Departments seeded successfully");
  } catch (error) {
    logger.error("Error seeding departments:", error);
  }
};
