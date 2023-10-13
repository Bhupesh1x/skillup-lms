import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { getCourses } from "@/actions/getCourses";

import Categories from "./_components/Categories";
import SearchInput from "@/components/shared/SearchInput";
import CourseList from "@/components/shared/CourseList";

type SeachPageProps = {
  searchParams: {
    title: string;
    categoryId: string;
  };
};

async function page({ searchParams }: SeachPageProps) {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const courses = await getCourses({ userId, ...searchParams });

  return (
    <>
      <div className="pb-6 md:mb-0 block md:hidden">
        <SearchInput />
      </div>
      <Categories items={categories} />
      <CourseList items={courses} />
    </>
  );
}

export default page;
