import { db } from "@/lib/db";
import { Course, Purchase } from "@prisma/client";

type PurchaseWithCourse = Purchase & {
  course: Course;
};

const groupByCourse = (puchases: PurchaseWithCourse[]) => {
  const grouped: { [courseTitle: string]: number } = {};

  puchases.forEach((puchase) => {
    const courseTitle = puchase.course.title;

    if (!grouped[courseTitle]) {
      grouped[courseTitle] = 0;
    }

    grouped[courseTitle] += puchase.course.price!;
  });

  return grouped;
};

export const getAnalytics = async (userId: string) => {
  try {
    const purchases = await db.purchase.findMany({
      where: {
        course: {
          userId,
        },
      },
      include: {
        course: true,
      },
    });

    const groupedEarnings = groupByCourse(purchases);

    const data = Object.entries(groupedEarnings).map(
      ([courseTitle, total]) => ({
        name: courseTitle,
        total,
      })
    );

    const totalRevenue = data.reduce((acc, curr) => (acc += curr.total), 0);
    const totalSales = purchases.length;

    return {
      data,
      totalRevenue,
      totalSales,
    };
  } catch (error) {
    console.log("get-analytics-error", error);
    return {
      data: [],
      totalRevenue: 0,
      totalSales: 0,
    };
  }
};
