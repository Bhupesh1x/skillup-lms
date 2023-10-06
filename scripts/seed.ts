const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
  try {
    await database.category.createMany({
      data: [
        { name: "Filming" },
        { name: "Engineering" },
        { name: "Accounting" },
        { name: "Photography" },
        { name: "Fitness" },
        { name: "Music" },
        { name: "Computer Science" },
      ],
    });

    console.log("Success");
  } catch (error) {
    console.log("Error seeding categories to database", error);
  } finally {
    await database.$disconnect();
  }
}

main();
