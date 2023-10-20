"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import toast from "react-hot-toast";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Chapter, Course } from "@prisma/client";
import ChaptersList from "./ChaptersList";

type Props = {
  initialData: Course & { chapters: Chapter[] };
};

const formSchema = z.object({
  title: z.string().min(1),
});

function ChaptersForm({ initialData }: Props) {
  const [isCreating, setIsCreating] = useState(false);

  const toogleCreating = () => setIsCreating((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const notify = toast.loading("Creating new Chapter...");
    try {
      await axios.post(`/api/courses/${initialData.id}/chapters`, values);
      toast.success("Chapter Created Successfully", {
        id: notify,
      });
      toogleCreating();
      router.refresh();
    } catch (error: any) {
      toast.error(error.response.statusText, {
        id: notify,
      });
    }
  }

  function onEdit(id: string) {
    router.push(`/teacher/courses/${initialData.id}/chapters/${id}`);
  }

  return (
    <div className="p-4 bg-slate-100 rounded-md border mt-6">
      <div className="flex font-medium items-center justify-between">
        <h1>Course Chapters</h1>
        <Button onClick={toogleCreating} variant="ghost">
          {isCreating ? (
            "Cancel"
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a chapter
            </>
          )}
        </Button>
      </div>
      {isCreating ? (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="eg. 'Introduction to the course'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={!isValid || isSubmitting}>
              Create
            </Button>
          </form>
        </Form>
      ) : (
        <>
          <div
            className={`text-sm mt-4 ${
              !initialData.chapters.length && "text-slate-500 italic"
            }`}
          >
            {initialData.chapters?.length ? (
              <>
                <ChaptersList
                  onEdit={onEdit}
                  items={initialData?.chapters || []}
                />
              </>
            ) : (
              "No Chapters"
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default ChaptersForm;
