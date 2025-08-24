"use client";
import { experienceLevel, JobInfoTable } from "@/drizzle/schema/jobinfo";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form"
import * as z from "zod";
import { jobInfoSchema  } from "../schemas";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formateExperienceLevel } from "../lib/formatters";
import { createJobInfo, updateJobInfo } from "../actions";
import { toast } from "sonner"



type JobInfoFormValues = z.infer<typeof jobInfoSchema>;


export function JobInfoForm({jobInfo}:{
  jobInfo?:Pick<typeof JobInfoTable.$inferInsert , "id" | "name" | "title"  | "description" | "experienceLevel">
}) {
  const form = useForm<JobInfoFormValues>({
    resolver: zodResolver(jobInfoSchema),
    defaultValues: jobInfo ?? {
      name: "",
      title:null,
      description:"",
      experienceLevel:"junior"
    },
  });
  async function onSubmit(values: JobInfoFormValues) {
    //@ts-expect-error some unwanted typecheck error
    const action = jobInfo ? updateJobInfo.bind(null, jobInfo.id) : createJobInfo
    const res = await action(values)
 
    if (res.error) {
      toast.error(res.message)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Job name" {...field} />
              </FormControl>
              <FormDescription>
              This name is displayed in the UI for easy identification.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title (Optional)</FormLabel>
                <FormControl>
                  <Input  placeholder="e.g. Frontend Developer" {...field} 
                  value={field.value ?? ""}
                  onChange={e=>field.onChange(e.target.value || null)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="experienceLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Experience Level</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select your experience level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {experienceLevel.map((level) => (
                      <SelectItem key={level} value={level}>
                       {formateExperienceLevel(level)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about your background and what you're looking for..."
                 
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Briefly describe your experience and career goals
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
          {jobInfo ? "Update Job Description" : "Save Job Description"}
          </Button>
      </form>
    </Form>
  );
}
