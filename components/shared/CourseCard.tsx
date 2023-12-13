import Link from "next/link";
import Image from "next/image";

import { IconBadge } from "./IconBadge";

import { BookOpen } from "lucide-react";
import { formatPrice } from "@/lib/format";
import CourseProgress from "./CourseProgress";

type Props = {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  chaptersLength: number;
  progress: number | null;
  category: string;
};

function CourseCard({
  id,
  title,
  price,
  imageUrl,
  chaptersLength,
  progress,
  category,
}: Props) {
  return (
    <Link href={`/courses/${id}`}>
      <div
        className="group p-3 hover:!shadow-sm h-full overflow-hidden border rounded-lg transition"
        data-cy="course-lists"
      >
        <div className="aspect-video overflow-hidden rounded-md relative w-full">
          <Image fill src={imageUrl} alt={title} className="object-cover" />
        </div>
        <div className="flex flex-col pt-2">
          <p className="text-lg md:text-base group-hover:text-sky-700 font-medium transition line-clamp-2">
            {title}
          </p>
          <p className="text-xs text-muted-foreground">{category}</p>
          <div className="my-3 flex items-center text-sm md:text-xs gap-x-2">
            <div className="flex items-center gap-x-1 text-slate-500">
              <IconBadge size="sm" icon={BookOpen} />
              <span>
                {chaptersLength} {chaptersLength === 1 ? "Chapter" : "Chapters"}
              </span>
            </div>
          </div>
          {progress === null ? (
            <p className="text-lg md:text-base font-medium text-slate-700">
              {formatPrice(price)}
            </p>
          ) : (
            <CourseProgress
              variant={progress === 100 ? "success" : "default"}
              size="sm"
              value={progress}
            />
          )}
        </div>
      </div>
    </Link>
  );
}

export default CourseCard;
