"use client"

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
import { priceSchema } from "../../../_utils/form-validation";

interface EditPriceProps {
    initialData: Course
    courseId: string;
    formLabel: string
    toggleModal: () => void
}

export const EditPriceForm = ({
    initialData,
    courseId,
    formLabel,
    toggleModal
}: EditPriceProps) => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false); // State variable for submission status

    const form = useForm<z.infer<typeof priceSchema>>({
        resolver: zodResolver(priceSchema),
        defaultValues: {
            price: initialData?.price || undefined,
        },
    });

    const editPrice = async (values: z.infer<typeof priceSchema>) => {
        setIsSubmitting(true);
        try {
            const response = await axios.patch(`/api/courses/${courseId}`, values);
            router.refresh();
            return response;
        } catch (error) {
            console.log(error)
            throw error
        } finally {
            setIsSubmitting(false);
            toggleModal()
        }
    };

    const onSubmit = async (values: z.infer<typeof priceSchema>) => {
        try {
            const response = toast.promise(editPrice(values), {
                loading: "Processing",
                error: "An error occured, please try again later.",
                success: "Course Price Updated!"
            });
            return response;
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
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-medium flex items-center justify-between">
                                        {formLabel}
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isSubmitting}
                                            placeholder="Set a price to your course"
                                            type="number"
                                            step="0.01"
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



