"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import axios from "axios";
import toast from "react-hot-toast";

import { TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useConfettiStore } from "@/hooks/use-confetti-store";
import { ConfirmModal } from "@/components/modals/ConfirmModal";

type Props = {
  disabled: boolean;
  courseId: string;
  isPublished: boolean;
};

function Actions({ disabled, courseId, isPublished }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const confetti = useConfettiStore();

  const onPublish = async () => {
    const notify = toast.loading(
      `Course ${isPublished ? "Unpublishing" : "Publishing"}...`
    );

    try {
      setIsLoading(true);

      await axios.patch(
        `/api/courses/${courseId}/${isPublished ? "unpublish" : "publish"}`
      );

      toast.success(`Course ${isPublished ? "Unpublished" : "published"}`, {
        id: notify,
      });

      if (!isPublished) {
        confetti.onOpen();
      }

      router.refresh();
    } catch (error: any) {
      toast.error(error.response.statusText, {
        id: notify,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    const notify = toast.loading("Course deleting...");

    try {
      setIsLoading(true);

      await axios.delete(`/api/courses/${courseId}`);

      toast.success("Course deleted", {
        id: notify,
      });

      router.refresh();
      router.push(`/teacher/courses`);
    } catch (error: any) {
      toast.error(error.response.statusText, {
        id: notify,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={onPublish}
        disabled={disabled || isLoading}
        variant="outline"
        size="sm"
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button size="sm" disabled={isLoading}>
          <TrashIcon className="w-4 h-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
}

export default Actions;
