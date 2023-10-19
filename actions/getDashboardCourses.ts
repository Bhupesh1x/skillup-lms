import { db } from "@/lib/db";

import { Category, Chapter, Course } from "@prisma/client";
import { getProgress } from "./getProgress";

type CourseWithCategoryAndProgress = Course & {
  category: Category;
  chapters: Chapter[];
  progress: number | null;
};

type DashboardCourses = {
  completedCourses: CourseWithCategoryAndProgress[];
  coursesInProgress: CourseWithCategoryAndProgress[];
};

export const getDashboardCourses = async (
  userId: string
): Promise<DashboardCourses> => {
  try {
    const purchasedCourses = await db.purchase.findMany({
      where: {
        userId,
      },
      select: {
        course: {
          include: {
            category: true,
            chapters: {
              where: {
                isPublished: true,
              },
            },
          },
        },
      },
    });

    const courses = purchasedCourses.map(
      (purchasedCourse) => purchasedCourse.course
    ) as CourseWithCategoryAndProgress[];

    for (let course of courses) {
      const progress = await getProgress(userId, course.id);
      course["progress"] = progress;
    }

    const completedCourses = courses.filter(
      (course) => course.progress === 100
    );
    const coursesInProgress = courses.filter(
      (course) => (course.progress ?? 0) < 100
    );

    return {
      completedCourses,
      coursesInProgress,
    };
  } catch (error) {
    console.log("get-dashboard-courses-error", error);
    return {
      completedCourses: [],
      coursesInProgress: [],
    };
  }
};
