import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const { courseId } = params;
    const { title } = await req.json();

    if (!userId) return new NextResponse("User Unauthorized", { status: 401 });

    const isCourseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
    });

    if (!isCourseOwner)
      return new NextResponse("User Unauthorized", { status: 401 });

    const lastChapter = await db.chapter.findFirst({
      where: {
        courseId: params.courseId,
      },
      orderBy: {
        position: "desc",
      },
    });

    const newPosition = lastChapter?.position ? lastChapter?.position + 1 : 1;

    const chapter = await db.chapter.create({
      data: {
        courseId,
        title,
        position: newPosition,
      },
    });

    return NextResponse.json(chapter);
  } catch (error: any) {
    console.log("course_chapters", error);
    return new NextResponse(error, { status: 500 });
  }
}
