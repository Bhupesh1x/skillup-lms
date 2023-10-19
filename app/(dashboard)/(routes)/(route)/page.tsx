import { getDashboardCourses } from "@/actions/getDashboardCourses";
import CourseList from "@/components/shared/CourseList";
import { UserButton, auth } from "@clerk/nextjs";
import { CheckCircle, Clock } from "lucide-react";
import { redirect } from "next/navigation";
import InfoCard from "./_components/InfoCard";

async function Home() {
  const { userId } = auth();

  if (!userId) {
    redirect("/");
  }

  const { completedCourses, coursesInProgress } = await getDashboardCourses(
    userId
  );
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard
          icon={Clock}
          label="In Progress"
          numberOfItems={coursesInProgress?.length}
        />
        <InfoCard
          icon={CheckCircle}
          label="Completed"
          numberOfItems={completedCourses?.length}
          variant="success"
        />
      </div>
      <CourseList items={[...coursesInProgress, ...completedCourses]} />
    </div>
  );
}

export default Home;
