"use client"

import { codeSchema } from "@/app/(dashboard)/(routes)/teacher/courses/_components/_utils/form-validation";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Course } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

interface CodeFormProps {
    initialData: Course
    courseId: string;
    formLabel: string
    toggleModal: () => void
}

export const EditCodeForm = ({
    initialData,
    courseId,
    formLabel,
    toggleModal
}: CodeFormProps) => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false); // State variable for submission status

    const form = useForm<z.infer<typeof codeSchema>>({
        resolver: zodResolver(codeSchema),
        defaultValues: initialData,
    });

    const editCode = async (values: z.infer<typeof codeSchema>) => {
        setIsSubmitting(true);
        try {
            const response = await axios.patch(`/api/courses/${courseId}`, values);
            router.refresh();
            return response;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    if (error.response.status === 403) {
                        throw new Error("Duplicate code");
                    }
                }
            }
            if (error)
                throw error.toString();
        } finally {
            setIsSubmitting(false);
            toggleModal();
        }
    };

    const onSubmit = async (values: z.infer<typeof codeSchema>) => {
        try {
            const response = await toast.promise(
                editCode(values),
                {
                    loading: "Processing",
                    error: (error) => {
                        return error.message === "Duplicate code" ? "Duplicate code, please try another title." : "An error occurred, please try again later.";
                    },
                    success: "Course Code Updated!"
                }
            );
            return response;
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Form {...form}>
            <form id="edit-course" onSubmit={form.handleSubmit(onSubmit)} className={cn("grid items-start gap-4")}>
                <div className="grid gap-6">
                    <div className="grid gap-3">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-medium flex items-center justify-between">
                                        {formLabel}
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isSubmitting} // Disable input field while submitting
                                            placeholder="e.g Advanced Web Development"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <Button type="submit" disabled={isSubmitting}> {/* Disable button while submitting */}
                    Save
                </Button>
            </form>
        </Form>
    );
};

