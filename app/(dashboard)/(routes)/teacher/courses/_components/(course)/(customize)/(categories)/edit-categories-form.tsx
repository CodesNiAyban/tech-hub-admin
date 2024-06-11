"use client"

import { categoriesSchema } from "@/app/(dashboard)/(routes)/teacher/courses/_components/_utils/form-validation";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import MultiSelectFormField from "@/components/ui/multi-select";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category, Course } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

interface CategoriesFormProps {
    initialData: Course & { categories: Category[] };
    courseId: string;
    formLabel: string;
    toggleModal: () => void;
    categories: {
        id: string;
        name: string;
    }[]
}

export const EditCategoriesForm = ({
    initialData,
    courseId,
    formLabel,
    toggleModal,
    categories
}: CategoriesFormProps) => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false); // State variable for submission status

    const form = useForm<z.infer<typeof categoriesSchema>>({
        resolver: zodResolver(categoriesSchema),
        defaultValues: {
            categories: initialData.categories.map((category) => category.id),
        },
    });

    const editCategories = async (values: z.infer<typeof categoriesSchema>) => {
        setIsSubmitting(true); // Set submission status to true
        try {
            const response = await axios.patch(`/api/courses/${courseId}/categories`, values);
            router.refresh();
            return response;
        } catch (error) {
            console.log(error)
            throw error;
        } finally {
            setIsSubmitting(false); // Reset submission status to false
            toggleModal()
        }
    };

    const onSubmit = async (values: z.infer<typeof categoriesSchema>) => {
        try {
            const response = toast.promise(
                editCategories(values),
                {
                    loading: "Processing",
                    error: "An error occured, please try again later.",
                    success: "Course Categories Updated!"
                }
            );
            return response
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
                            name="categories"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel className="font-medium flex items-center justify-between">
                                        {formLabel}
                                    </FormLabel>
                                    <FormControl>
                                        <MultiSelectFormField
                                            options={categories.map(category => ({
                                                label: category.name,
                                                value: category.id
                                            }))}
                                            defaultValue={field.value}
                                            onValueChange={field.onChange}
                                            placeholder="Select options"
                                            variant="inverted"
                                            animation={2}
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

