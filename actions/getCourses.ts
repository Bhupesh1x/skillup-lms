import { db } from "@/lib/db";
import { Category, Course } from "@prisma/client";
import { getProgress } from "./getProgress";

type CourseWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
};

type GetCourses = {
  userId: string;
  categoryId?: string;
  title?: string;
};

export const getCourses = async ({ userId, categoryId, title }: GetCourses) => {
  try {
    const courses = await db.course.findMany({
      where: {
        isPublished: true,
        categoryId,
        title: {
          contains: title,
        },
      },
      include: {
        category: true,
        chapters: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
          },
        },
        purchases: {
          where: {
            userId,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const coursesWithProgress: CourseWithProgressWithCategory[] =
      await Promise.all(
        courses.map(async (course) => {
          if (course.purchases.length === 0) {
            return {
              ...course,
              progress: null,
            };
          }

          const progressWithPercentage = await getProgress(userId, course.id);

          return { ...course, progress: progressWithPercentage };
        })
      );

    return coursesWithProgress;
  } catch (error) {
    console.log("get-courses", error);
    return [];
  }
};
