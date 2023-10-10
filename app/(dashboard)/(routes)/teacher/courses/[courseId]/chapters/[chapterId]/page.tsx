import { IconBadge } from "@/components/shared/IconBadge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { ArrowLeft, Eye, LayoutDashboard, Video } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import ChapterTitleForm from "./_components/ChapterTitleForm";
import ChapterDescriptionForm from "./_components/ChapterDescriptionForm";
import ChapterAccessForm from "./_components/ChapterAccessForm";

async function chapterEditPage({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) {
  const { userId } = auth();
  const { courseId, chapterId } = params;

  if (!userId) {
    return redirect("/");
  }

  const chapter = await db.chapter.findUnique({
    where: {
      id: chapterId,
      courseId,
    },
    include: {
      muxData: true,
    },
  });

  if (!chapter) {
    return redirect("/");
  }

  const requiredFields = [chapter.title, chapter.description, chapter.videoUrl];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  return (
    <div className="pb-6">
      <Link
        className="flex items-center font-medium text-sm hover:opacity-75 transition mb-6"
        href={`/teacher/courses/${courseId}`}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to course setup
      </Link>

      <h1 className="text-2xl font-medium">Chapter Creation</h1>
      <p className="text-sm text-slate-700 font-medium mt-2">
        Complete all fields ({completedFields}/{totalFields})
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-14 mt-16">
        {/* Chapter Details Left Side */}
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-xl font-medium">Customize your chapter</h2>
          </div>
          <ChapterTitleForm initialData={chapter} courseId={courseId} />
          <ChapterDescriptionForm initialData={chapter} courseId={courseId} />
          <div className="mt-8">
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Eye} />
              <h2 className="text-xl font-medium">Access Settings</h2>
            </div>
            <ChapterAccessForm initialData={chapter} courseId={courseId} />
          </div>
        </div>
        {/* Chapter Details Right Side */}
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={Video} />
            <h2 className="text-xl font-medium">Add a video</h2>
          </div>
          {/* TODO : ADD VIDEO FORM */}
        </div>
      </div>
    </div>
  );
}

export default chapterEditPage;
