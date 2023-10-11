import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();
    const { courseId, chapterId } = params;

    if (!userId) return new NextResponse("User Unauthorized", { status: 401 });

    const isCourseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
    });

    if (!isCourseOwner)
      return new NextResponse("User Unauthorized", { status: 401 });

    const unPublishedChapter = await db.chapter.update({
      where: {
        id: chapterId,
        courseId,
      },
      data: {
        isPublished: false,
      },
    });

    const publishedChapterInCourse = await db.chapter.findMany({
      where: {
        courseId,
        isPublished: true,
      },
    });

    if (!publishedChapterInCourse.length) {
      await db.course.update({
        where: {
          id: courseId,
        },
        data: {
          isPublished: false,
        },
      });
    }

    return NextResponse.json(unPublishedChapter);
  } catch (error: any) {
    console.log("chapterid_unpublish_error", error);
    return new NextResponse(error, { status: 500 });
  }
}
