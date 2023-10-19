import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { chapterId: string; courseId: string } }
) {
  try {
    const { userId } = auth();
    const { chapterId, courseId } = params;
    const { isCompleted } = await req.json();

    if (!userId) return new NextResponse("User unauthorized", { status: 401 });

    const userProgress = await db.userProgress.upsert({
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        },
      },
      update: {
        isCompleted,
      },
      create: {
        userId,
        chapterId,
        isCompleted,
      },
    });

    return NextResponse.json(userProgress);
  } catch (error: any) {
    console.log("chapterid_progress", error);
    return new NextResponse(error, { status: 500 });
  }
}
