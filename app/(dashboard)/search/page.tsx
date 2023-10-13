import { db } from "@/lib/db";
import Categories from "./_components/Categories";
import SearchInput from "@/components/shared/SearchInput";

async function page() {
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <>
      <div className="pb-6 md:mb-0 block md:hidden">
        <SearchInput />
      </div>
      <Categories items={categories} />
    </>
  );
}

export default page;
