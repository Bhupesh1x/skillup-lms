import { auth } from "@clerk/nextjs";

import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { getProgress } from "@/actions/getProgress";

import CourseNavbar from "./_components/CourseNavbar";
import CourseSidebar from "./_components/CourseSidebar";

async function CourseLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { courseId: string };
}) {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        include: {
          userProgress: {
            where: {
              userId,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!course) {
    return redirect("/");
  }

  const progress = await getProgress(userId, course.id);

  return (
    <div className="flex">
      <nav className="h-[80px] md:pl-[25%] lg:pl-[17%] fixed z-[999] inset-y-0 w-full">
        <CourseNavbar course={course} progress={progress} />
      </nav>
      <aside className="hidden md:flex h-full md:w-[25%] lg:w-[17%] flex-col fixed inset-y-0 z-50">
        <CourseSidebar course={course} progress={progress} />
      </aside>
      <main className="w-full md:w-[75%] lg:w-[83%] mt-[80px] p-6 ml-auto">
        {children}
      </main>
    </div>
  );
}

export default CourseLayout;
