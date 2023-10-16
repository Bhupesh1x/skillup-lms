import { Menu } from "lucide-react";
import { Chapter, Course, UserProgress } from "@prisma/client";

import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import CourseSidebar from "./CourseSidebar";

type Props = {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progress: number;
};

function CourseMobileSidebar({ course, progress }: Props) {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden transition pr-4 hover:opacity-75">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-white w-72">
        <CourseSidebar course={course} progress={progress} />
      </SheetContent>
    </Sheet>
  );
}

export default CourseMobileSidebar;
