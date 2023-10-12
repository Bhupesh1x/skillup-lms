import { db } from "@/lib/db";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/DataTable";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

async function CoursesPage() {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const courses = await db.course.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div>
      <DataTable columns={columns} data={courses} />
    </div>
  );
}

export default CoursesPage;
