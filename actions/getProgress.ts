import { db } from "@/lib/db";

export const getProgress = async (
  userId: string,
  courseId: string
): Promise<number> => {
  try {
    const publishedChapters = await db.chapter.findMany({
      where: {
        courseId,
        isPublished: true,
      },
      select: {
        id: true,
      },
    });

    const publishedChaptersId = publishedChapters.map((chapter) => chapter.id);

    const validChapterId = await db.userProgress.count({
      where: {
        userId,
        chapterId: {
          in: publishedChaptersId,
        },
        isCompleted: true,
      },
    });

    const progressPercentage =
      (validChapterId / publishedChaptersId.length) * 100;

    return progressPercentage;
  } catch (error) {
    console.log("get_progress", error);
    return 0;
  }
};
