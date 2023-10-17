import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { getChapter } from "@/actions/getChapter";
import { Banner } from "@/components/shared/Banner";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/shared/preview";

import VideoPlayer from "./_components/VideoPlayer";
import CourseEnrollButton from "./_components/CourseEnrollButton";
import { File } from "lucide-react";

async function ChapterDetailsPage({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) {
  const { userId } = auth();

  if (!userId) {
    redirect("/");
  }

  const { courseId, chapterId } = params;
  const {
    chapter,
    course,
    attachments,
    muxData,
    nextChapter,
    purchase,
    userProgress,
  } = await getChapter({
    userId,
    courseId,
    chapterId,
  });

  if (!course || !chapter) {
    return redirect("/");
  }

  const isLocked = !chapter?.isFree && !purchase;
  const completeOnEnd = !!purchase && !userProgress?.isCompleted;

  return (
    <div>
      {userProgress?.isCompleted && (
        <Banner variant="success" label="You already completed the chapter." />
      )}
      {isLocked && (
        <Banner
          variant="warning"
          label="You need to purchase this course to watch this chapter."
        />
      )}
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4">
          <VideoPlayer
            chapterId={chapterId}
            title={chapter?.title}
            courseId={courseId}
            nextChapterId={nextChapter?.id!}
            playbackId={muxData?.playbackId!}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}
          />
        </div>
        <div className="p-4 flex flex-col md:flex-row items-center justify-between">
          <h2 className="text-2xl font-semibold mb-2">{chapter?.title}</h2>
          {purchase ? (
            <div>{/* TODO: User Progress */}</div>
          ) : (
            <CourseEnrollButton courseId={courseId} price={course.price!} />
          )}
        </div>
        <Separator />
        <div className="p-4">
          <Preview value={chapter?.description!} />
        </div>
        {!!attachments &&
          attachments.map((attachment) => (
            <a
              target="_blank"
              href={attachment.url}
              key={attachment.id}
              className="flex items-center p-3 w-full border bg-sky-200 text-sky-700 gap-2 rounded-md hover:underline"
            >
              <File className="h-4 w-4" />
              <p className="line-clamp-1">{attachment.name}</p>
            </a>
          ))}
      </div>
    </div>
  );
}

export default ChapterDetailsPage;
