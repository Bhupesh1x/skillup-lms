import { db } from "@/lib/db";
import Categories from "./_components/Categories";

async function page() {
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div>
      <Categories items={categories} />
    </div>
  );
}

export default page;
