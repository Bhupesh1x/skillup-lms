import Mux from "@mux/mux-node";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

const { Video } = new Mux(
  process.env.MUX_TOKEN_ID!,
  process.env.MUX_TOKEN_SECRET!
);

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();
    const { courseId, chapterId } = params;
    const { isPublished, ...values } = await req.json();

    if (!userId) return new NextResponse("User Unauthorized", { status: 401 });

    const isCourseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
    });

    if (!isCourseOwner)
      return new NextResponse("User Unauthorized", { status: 401 });

    const chapter = await db.chapter.update({
      where: {
        id: chapterId,
        courseId,
      },
      data: {
        ...values,
      },
    });

    if (values.videoUrl) {
      const isExistingMuxData = await db.muxData.findFirst({
        where: {
          chapterId,
        },
      });

      if (isExistingMuxData) {
        await Video.Assets.del(isExistingMuxData.assetId);
        await db.muxData.delete({
          where: {
            id: isExistingMuxData.id,
          },
        });
      }

      const asset = await Video.Assets.create({
        input: values.videoUrl,
        playback_policy: "public",
        test: false,
      });

      await db.muxData.create({
        data: {
          assetId: asset.id,
          chapterId,
          playbackId: asset?.playback_ids?.[0]?.id,
        },
      });
    }

    return NextResponse.json(chapter);
  } catch (error: any) {
    console.log("chapterid_error", error);
    return new NextResponse(error, { status: 500 });
  }
}
