import { IconBadge } from "@/components/shared/IconBadge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { LayoutDashboard } from "lucide-react";
import { redirect } from "next/navigation";
import TitleForm from "./_components/TitleForm";
import DescriptionForm from "./_components/DescriptionForm";
import ImageForm from "./_components/ImageForm";

async function CourseDetailsPage({ params }: { params: { courseId: string } }) {
  const { userId } = auth();

  if (!userId) {
    redirect("/");
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
  });

  if (!course) {
    redirect("/");
  }

  const requiredFields = [
    course.title,
    course.description,
    course.imageurl,
    course.price,
    course.categoryId,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  return (
    <div>
      <h1 className="text-2xl font-medium">Course Setup</h1>
      <p className="text-sm text-slate-700 font-medium mt-2">
        Complete all fields ({completedFields}/{totalFields})
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-xl font-medium">Customize your course</h2>
          </div>
          <TitleForm initialData={course} />
          <DescriptionForm initialData={course} />
          <ImageForm initialData={course} />
        </div>
      </div>
    </div>
  );
}

export default CourseDetailsPage;
