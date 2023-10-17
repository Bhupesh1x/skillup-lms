"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { Attachment, Course } from "@prisma/client";

import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { File, Loader2, PlusCircle, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/shared/FileUpload";

type Props = {
  initialData: Course & { attachments: Attachment[] };
};

const formSchema = z.object({
  url: z.string().min(1),
});

function AttachmentForm({ initialData }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const toogleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const notify = toast.loading("Updating Course Attachment...");
    try {
      await axios.post(`/api/courses/${initialData.id}/attachments`, values);
      toast.success("Course Attachment Updated Successfully", {
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

  async function onDelete(id: string) {
    try {
      setDeletingId(id);
      await axios.delete(`/api/courses/${initialData.id}/attachments/${id}`);
      toast.success("Course Attachment deleted Successfully");
      router.refresh();
    } catch (error: any) {
      toast.error(error.response.statusText);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="p-4 bg-slate-100 rounded-md border mt-6">
      <div className="flex font-medium items-center justify-between">
        <h1>Course Attachments</h1>
        <Button onClick={toogleEdit} variant="ghost">
          {isEditing ? (
            "Cancel"
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add an File
            </>
          )}
        </Button>
      </div>
      {isEditing ? (
        <>
          <FileUpload
            endpoint="courseAttachment"
            onChange={(url) => {
              if (url) {
                onSubmit({ url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Add anything your students might need to complete the course.
          </div>
        </>
      ) : (
        <>
          {initialData?.attachments?.length ? (
            <div className="space-y-2 mt-4">
              {initialData?.attachments?.map((attachment) => (
                <div
                  className="flex items-center text-sky-700 bg-sky-100 rounded-md border p-3 w-full gap-x-2"
                  key={attachment.id}
                >
                  <File className="h-4 w-4 flex-shrink-0" />
                  <p className="text-xs line-clamp-1">{attachment.name}</p>

                  {deletingId !== attachment.id ? (
                    <button
                      onClick={() => onDelete(attachment.id)}
                      className="ml-auto hover:opacity-75 transition"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  ) : (
                    <Loader2 className="h-4 w-4 animate-spin ml-auto" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 italic text-sm">No Attachments Yet</p>
          )}
        </>
      )}
    </div>
  );
}

export default AttachmentForm;
