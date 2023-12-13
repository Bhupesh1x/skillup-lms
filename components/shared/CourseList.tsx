import { Category, Course } from "@prisma/client";
import CourseCard from "./CourseCard";

type CourseWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
};

type Props = {
  items: CourseWithProgressWithCategory[];
};

const CourseList = ({ items }: Props) => {
  return (
    <div className="py-6">
      <div
        className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4"
        data-cy="course-list-container"
      >
        {items.map((item) => (
          <CourseCard
            key={item.id}
            id={item.id}
            title={item.title}
            price={item.price!}
            imageUrl={item.imageurl!}
            chaptersLength={item.chapters?.length}
            progress={item.progress}
            category={item?.category?.name!}
          />
        ))}
      </div>
      {items?.length === 0 && (
        <p className="text-lg text-muted-foreground mt-12 text-center">
          No courses found
        </p>
      )}
    </div>
  );
};

export default CourseList;
