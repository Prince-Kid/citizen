import { User } from "../models/User";
import { logger } from "../utils/logger";

export const seedUsers = async () => {
  try {
    // Check if users already exist
    const count = await User.countDocuments();
    if (count > 0) {
      logger.info("Users already seeded");
      return;
    }

    const users = [
      {
        name: "Admin User",
        email: "admin@example.com",
        password: "admin123",
        role: "admin",
      },
      {
        name: "Department Head",
        email: "head@example.com",
        password: "head123",
        role: "department_head",
      },
      {
        name: "Regular User",
        email: "user@example.com",
        password: "user123",
        role: "citizen",
      },
    ];

    await Promise.all(users.map((user) => new User(user).save()));
    logger.info("Users seeded successfully");
  } catch (error) {
    logger.error("Error seeding users:", error);
  }
};
