import connectDB from "../config/database";
import { seedUsers } from "./userSeeder";
import { seedDepartments } from "./departmentSeeder";
import { seedComplaints } from "./complaintSeeder";
import { logger } from "../utils/logger";

const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();
    logger.info("Connected to database");

    // Seed users first
    const users = await seedUsers();
    logger.info("Users seeded successfully");

    // Seed departments using the created users
    const departments = await seedDepartments(users);
    logger.info("Departments seeded successfully");
    // Seed complaints using the created users and departments
    const complaints = await seedComplaints(users, departments);
    logger.info("Complaints seeded successfully");

    logger.info("Database seeding completed successfully");
    process.exit(0);
  } catch (error) {
    logger.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
