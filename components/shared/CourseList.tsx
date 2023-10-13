import { Category, Course } from "@prisma/client";

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
      {items.map((item) => (
        <div key={item.id}>{item.title}</div>
      ))}
    </div>
  );
};

export default CourseList;
