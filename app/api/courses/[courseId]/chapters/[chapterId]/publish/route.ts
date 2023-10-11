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

    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        courseId,
      },
    });

    const muxData = await db.muxData.findUnique({
      where: {
        chapterId,
      },
    });

    if (
      !muxData ||
      !chapter ||
      !chapter.title ||
      !chapter.description ||
      !chapter.videoUrl
    ) {
      return new NextResponse("Missing required parameters", { status: 400 });
    }

    const publishedChapter = await db.chapter.update({
      where: {
        id: chapterId,
        courseId,
      },
      data: {
        isPublished: true,
      },
    });

    return NextResponse.json(publishedChapter);
  } catch (error: any) {
    console.log("chapterid_publish_error", error);
    return new NextResponse(error, { status: 500 });
  }
}
