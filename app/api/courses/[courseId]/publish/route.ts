import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const { courseId } = params;

    if (!userId) return new NextResponse("User Unauthorized", { status: 401 });

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
      include: {
        chapters: {
          include: {
            muxData: true,
          },
        },
      },
    });

    if (!course) {
      return new NextResponse("Course not found", { status: 401 });
    }

    const hasPublishedChapter = course?.chapters?.some(
      (chapter) => chapter.isPublished
    );

    if (
      !course.title ||
      !course.categoryId ||
      !course.description ||
      !course.imageurl ||
      !course.price ||
      !hasPublishedChapter
    ) {
      return new NextResponse("Missing required fileds", { status: 401 });
    }

    const publishedChapter = await db.course.update({
      where: {
        id: courseId,
        userId,
      },
      data: {
        isPublished: true,
      },
    });

    return NextResponse.json(publishedChapter);
  } catch (error: any) {
    console.log("course_id_publish", error);
    return new NextResponse(error, { status: 500 });
  }
}
