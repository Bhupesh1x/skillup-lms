import { IconBadge } from "@/components/shared/IconBadge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import {
  CircleDollarSign,
  File,
  LayoutDashboard,
  ListChecks,
} from "lucide-react";
import { redirect } from "next/navigation";
import TitleForm from "./_components/TitleForm";
import DescriptionForm from "./_components/DescriptionForm";
import ImageForm from "./_components/ImageForm";
import CategoryForm from "./_components/CategoryForm";
import PriceForm from "./_components/PriceForm";
import AttachmentForm from "./_components/AttachmentForm";
import ChaptersForm from "./_components/ChaptersForm";
import { Banner } from "@/components/shared/Banner";
import Actions from "./_components/Actions";

async function CourseDetailsPage({ params }: { params: { courseId: string } }) {
  const { userId } = auth();

  if (!userId) {
    redirect("/");
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
      userId,
    },
    include: {
      attachments: {
        orderBy: {
          createdAt: "desc",
        },
      },
      chapters: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
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
    course.chapters?.some((chapter) => chapter?.isPublished),
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!course?.isPublished && (
        <Banner
          variant="warning"
          label="This course is not published. It will not be visible to the students."
        />
      )}
      <div className={`pb-6 ${!course?.isPublished && "pt-6"}`}>
        <div className="flex justify-between">
          <div>
            <h1 className="text-2xl font-medium">Course Setup</h1>
            <p className="text-sm text-slate-700 font-medium mt-2">
              Complete all fields ({completedFields}/{totalFields})
            </p>
          </div>
          <Actions
            disabled={!isComplete}
            courseId={course?.id}
            isPublished={course?.isPublished}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl font-medium">Customize your course</h2>
            </div>
            <TitleForm initialData={course} />
            <DescriptionForm initialData={course} />
            <ImageForm initialData={course} />
            <CategoryForm
              initialData={course}
              options={categories.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
            />
          </div>
          <div className="space-y-6">
            <div className="flex items-center gap-x-2">
              <IconBadge icon={ListChecks} />
              <h2 className="text-xl font-medium">Course Chapters</h2>
            </div>
            <div>
              <ChaptersForm initialData={course} />
            </div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={CircleDollarSign} />
              <h2 className="text-xl font-medium">Sell Your Course</h2>
            </div>
            <div>
              <PriceForm initialData={course} />
            </div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={File} />
              <h2 className="text-xl font-medium">Resources & Attachments</h2>
            </div>
            <div>
              <AttachmentForm initialData={course} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CourseDetailsPage;
