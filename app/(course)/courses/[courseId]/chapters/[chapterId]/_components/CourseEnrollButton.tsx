import { formatPrice } from "@/lib/format";

import { Button } from "@/components/ui/button";

type Props = {
  courseId: string;
  price: number;
};

function CourseEnrollButton({ courseId, price }: Props) {
  return (
    <Button size="sm" className="w-full md:w-auto">
      Enroll for {formatPrice(price)}
    </Button>
  );
}

export default CourseEnrollButton;
