"use client"

import { titleSchema } from "@/app/(dashboard)/(routes)/teacher/courses/_components/_utils/form-validation";
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

interface TitleFormProps {
    initialData: Course
    courseId: string;
    formLabel: string
    toggleModal: () => void
}

export const EditTitleForm = ({
    initialData,
    courseId,
    formLabel,
    toggleModal
}: TitleFormProps) => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false); // State variable for submission status

    const form = useForm<z.infer<typeof titleSchema>>({
        resolver: zodResolver(titleSchema),
        defaultValues: initialData,
    });

    const editTitle = async (values: z.infer<typeof titleSchema>) => {
        setIsSubmitting(true); // Set submission status to true
        try {
            const response = await axios.patch(`/api/courses/${courseId}`, values);
            router.refresh();
            return response;
        } catch (error) {
            if (typeof error === 'string') {
                toast.error(error);
            } else {
                toast.error("An error occurred. Please try again later.");
            }
        } finally {
            setIsSubmitting(false); // Reset submission status to false
            toggleModal()
        }
    };

    const onSubmit = async (values: z.infer<typeof titleSchema>) => {
        try {
            const response = editTitle(values);
            toast.promise(response, {
                loading: "Processing",
                error: "An error occured, please try again later.",
                success: "Course Title Updated!"
            });
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Form {...form}>
            <form id="edit-course" onSubmit={form.handleSubmit(onSubmit)} className={cn("grid items-start gap-4")}>
                <div className="grid gap-6">
                    <div className="grid gap-3">
                        <FormField
                            control={form.control}
                            name="title"
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

