"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

import { CheckCircle, XCircle } from "lucide-react";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import axios from "axios";

type Props = {
  chapterId: string;
  courseId: string;
  nextChapterId?: string;
  isCompleted?: boolean;
};

function CourseProgressButton({
  chapterId,
  courseId,
  nextChapterId,
  isCompleted,
}: Props) {
  const Icon = isCompleted ? XCircle : CheckCircle;
  const router = useRouter();
  const confetti = useConfettiStore();

  const [isLoading, setIsLoadding] = useState(false);

  const onClick = async () => {
    const notify = toast.loading("Updating Progress...");

    try {
      setIsLoadding(true);

      await axios.put(
        `/api/courses/${courseId}/chapters/${chapterId}/progress`,
        {
          isCompleted: !isCompleted,
        }
      );

      if (!isCompleted && !nextChapterId) {
        confetti.onOpen();
      }

      if (!isCompleted && nextChapterId) {
        router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
      }

      toast.success("Progress Updated", {
        id: notify,
      });
      router.refresh();
    } catch (error: any) {
      toast.error(error.response.statusText, {
        id: notify,
      });
    } finally {
      setIsLoadding(false);
    }
  };

  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      type="button"
      variant={isCompleted ? "outline" : "success"}
      className="w-full md:w-auto"
    >
      {isCompleted ? "Mark as Uncomplete" : "Mark as complete"}
      <Icon className="h-4 w-4 ml-2" />
    </Button>
  );
}

export default CourseProgressButton;
