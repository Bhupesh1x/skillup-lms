"use client";

import * as z from "zod";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import { Course } from "@prisma/client";

import toast from "react-hot-toast";
import { ImageIcon, PencilIcon, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/shared/FileUpload";

type Props = {
  initialData: Course;
};

const formSchema = z.object({
  imageurl: z.string().min(1, {
    message: "image is required!",
  }),
});

function ImageForm({ initialData }: Props) {
  const [isEditing, setIsEditing] = useState(false);

  const toogleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const notify = toast.loading("Updating Course...");
    try {
      await axios.patch(`/api/courses/${initialData.id}`, values);
      toast.success("Course Updated", {
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
        <h1>Course Image</h1>
        <Button onClick={toogleEdit} variant="ghost">
          {isEditing ? (
            "Cancel"
          ) : (
            <>
              {initialData?.imageurl ? (
                <PencilIcon className="h-4 w-4 mr-2" />
              ) : (
                <PlusCircle className="h-4 w-4 mr-2" />
              )}
              {initialData?.imageurl ? "Edit Image" : "Add an Image"}
            </>
          )}
        </Button>
      </div>
      {isEditing ? (
        <>
          <FileUpload
            endpoint="courseImage"
            onChange={(url) => {
              if (url) {
                onSubmit({ imageurl: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            16:9 aspect ratio recommended
          </div>
        </>
      ) : (
        <>
          {initialData?.imageurl ? (
            <div className="relative aspect-video mt-2">
              <Image
                alt="upload"
                fill
                className="object-cover rounded-md"
                src={initialData.imageurl}
              />
            </div>
          ) : (
            <div className="h-60 flex items-center justify-center bg-slate-200 rounded-md">
              <ImageIcon className="h-10 w-10 text-slate-500" />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ImageForm;
