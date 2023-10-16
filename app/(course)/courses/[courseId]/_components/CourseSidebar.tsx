import { db } from "@/lib/db";

import { auth } from "@clerk/nextjs";

import { redirect } from "next/navigation";
import { Chapter, Course, UserProgress } from "@prisma/client";

import CourseSidebarItem from "./CourseSidebarItem";

type Props = {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progress: number;
};

async function CourseSidebar({ course, progress }: Props) {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const purchase = await db.purchase.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: course.id,
      },
    },
  });

  return (
    <div className="h-full borser-r shadow flex flex-col overscroll-y-auto min-h-screen">
      <div className="p-8 flex flex-col border-b">
        <h1 className="font-semibold mx-auto">{course.title}</h1>
      </div>
      <div className="flex flex-col w-full">
        {course.chapters?.map((chapter) => (
          <CourseSidebarItem
            key={chapter.id}
            id={chapter.id}
            label={chapter.title}
            isCompleted={!!chapter?.userProgress?.[0]?.isCompleted}
            courseId={course.id}
            isLocked={!chapter?.isFree && !purchase}
          />
        ))}
      </div>
    </div>
  );
}

export default CourseSidebar;
