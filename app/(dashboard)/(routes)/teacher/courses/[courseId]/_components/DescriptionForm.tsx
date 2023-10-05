"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import toast from "react-hot-toast";
import { PencilIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  initialData: {
    description: string | null;
    id: string;
  };
};

const formSchema = z.object({
  description: z.string().min(1, {
    message: "Description is required!",
  }),
});

function DescriptionForm({ initialData }: Props) {
  const [isEditing, setIsEditing] = useState(false);

  const toogleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData.description || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

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
        <h1>Course Description</h1>
        <Button onClick={toogleEdit} variant="ghost">
          {isEditing ? (
            "Cancel"
          ) : (
            <>
              <PencilIcon className="h-4 w-4 mr-2" />
              Edit Description
            </>
          )}
        </Button>
      </div>
      {isEditing ? (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      disabled={isSubmitting}
                      placeholder="eg. 'This course is about...'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center">
              <Button type="submit" disabled={!isValid || isSubmitting}>
                Save
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        <p
          className={`text-sm mt-4 ${
            !initialData.description && "text-slate-500 italic"
          }`}
        >
          {initialData.description || "No Description"}
        </p>
      )}
    </div>
  );
}

export default DescriptionForm;
