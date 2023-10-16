import NavbarRoutes from "@/components/NavbarRoutes";
import { Chapter, Course, UserProgress } from "@prisma/client";

import CourseMobileSidebar from "./CourseMobileSidebar";

type Props = {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progress: number;
};

function CourseNavbar({ course, progress }: Props) {
  return (
    <div className="p-4 flex items-center bg-white shadow-sm h-full border-b">
      <CourseMobileSidebar course={course} progress={progress} />
      <NavbarRoutes />
    </div>
  );
}

export default CourseNavbar;
