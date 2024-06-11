"use client"

import { Editor } from "@/components/editor";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import { Chapter } from "@prisma/client";
import { accessSchema } from "../../../../../_utils/form-validation";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EditChapterAccessProps {
    initialData: Chapter;
    courseId: string;
    chapterId: string;
    toggleModal: () => void
    formLabel: string
}

export const EditChapterAccessForm = ({
    initialData,
    courseId,
    formLabel,
    toggleModal,
    chapterId
}: EditChapterAccessProps) => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false); // State variable for submission status

    const form = useForm<z.infer<typeof accessSchema>>({
        resolver: zodResolver(accessSchema),
        defaultValues: {
            subscription: initialData.subscription || ""
        },
    });

    const editAccess = async (values: z.infer<typeof accessSchema>) => {
        setIsSubmitting(true); // Set submission status to true
        try {
            const response = await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
            router.refresh();
            return response;
        } catch (error) {
            console.error(error)
            throw error
        } finally {
            setIsSubmitting(false); // Reset submission status to false
            toggleModal()
        }
    };

    const onSubmit = async (values: z.infer<typeof accessSchema>) => {
        try {
            const response = toast.promise(
                editAccess(values),
                {
                    loading: "Processing",
                    error: "An error occured, please try again later.",
                    success: "Chapter Access Updated!"
                }
            );
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
                            name="subscription"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-3 rounded-md border p-4">
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a verified email to display" />
                                            </SelectTrigger>

                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="null">Free</SelectItem>
                                            <SelectItem value="BASIC">Basic</SelectItem>
                                            <SelectItem value="PRO">Pro</SelectItem>
                                        </SelectContent>
                                    </Select>
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