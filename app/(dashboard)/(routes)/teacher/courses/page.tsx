import { Button } from "@/components/ui/button";
import Link from "next/link";

function CoursesPage() {
  return (
    <div>
      <Link href="/teacher/create">
        <Button>New Course</Button>
      </Link>
    </div>
  );
}

export default CoursesPage;
