"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { Chapter, MuxData } from "@prisma/client";
import MuxPlayer from "@mux/mux-player-react";

import toast from "react-hot-toast";
import { PencilIcon, PlusCircle, Video } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/shared/FileUpload";

type Props = {
  initialData: Chapter & { muxData?: MuxData | null };
  courseId: string;
};

const formSchema = z.object({
  videoUrl: z.string().min(1),
});

function ChapterVideoForm({ initialData, courseId }: Props) {
  const [isEditing, setIsEditing] = useState(false);

  const toogleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const notify = toast.loading("Updating Chapter...");
    try {
      await axios.patch(
        `/api/courses/${courseId}/chapters/${initialData.id}`,
        values
      );
      toast.success("Chapter Updated", {
        id: notify,
      });
      toogleEdit();
      router.refresh();
    } catch (error: any) {
      toast.error(error.response.statusText, {
        id: notify,
      });
    }
  }

  return (
    <div className="p-4 bg-slate-100 rounded-md border mt-6">
      <div className="flex font-medium items-center justify-between">
        <h1>Chapter Video</h1>
        <Button onClick={toogleEdit} variant="ghost">
          {isEditing ? (
            "Cancel"
          ) : (
            <>
              {initialData?.videoUrl ? (
                <PencilIcon className="h-4 w-4 mr-2" />
              ) : (
                <PlusCircle className="h-4 w-4 mr-2" />
              )}
              {initialData?.videoUrl ? "Edit Video" : "Add a Video"}
            </>
          )}
        </Button>
      </div>
      {isEditing ? (
        <>
          <FileUpload
            endpoint="chapterVideo"
            onChange={(url) => {
              if (url) {
                onSubmit({ videoUrl: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Upload this chapter&apos;s video
          </div>
        </>
      ) : (
        <>
          {initialData?.videoUrl ? (
            <div className="relative aspect-video mt-2">
              <MuxPlayer
                playbackId={initialData?.muxData?.playbackId || ""}
                className="h-full w-full"
              />
            </div>
          ) : (
            <div className="h-60 flex items-center justify-center bg-slate-200 rounded-md">
              <Video className="h-10 w-10 text-slate-500" />
            </div>
          )}
        </>
      )}
      {initialData.videoUrl && !isEditing && (
        <p className="text-xs text-mutes-foreground mt-2">
          Videos can take few minutes to process. Refresh the page if video does
          not appear.
        </p>
      )}
    </div>
  );
}

export default ChapterVideoForm;
