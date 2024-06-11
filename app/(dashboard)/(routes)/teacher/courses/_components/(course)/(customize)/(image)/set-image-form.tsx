"use client"

import { FileUpload } from "@/components/file-upload";
import { zodResolver } from "@hookform/resolvers/zod";
import { Course } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import { imageSchema } from "../../../_utils/form-validation";

interface EditImageProps {
    initialData: Course
    courseId: string;
    formLabel: string
    toggleModal: () => void
}

export const EditImageForm = ({
    initialData,
    courseId,
    formLabel,
    toggleModal
}: EditImageProps) => {
    const router = useRouter();

    const setImage = async (values: z.infer<typeof imageSchema>) => {
        try {
            const response = await axios.patch(`/api/courses/${courseId}`, values);
            router.refresh();
            return response;
        } catch (error) {
            console.log(error)
        } finally {
            toggleModal()
        }
    };

    const onSubmit = async (values: z.infer<typeof imageSchema>) => {
        try {
            const response = setImage(values);
            toast.promise(response, {
                loading: "Processing",
                error: "An error occured, please try again later.",
                success: "Course Image Updated!"
            });
        } catch (error) {
            if (typeof error === 'string') {
                toast.error(error);
            } else {
                toast.error("An error occurred. Please try again later.");
            }
        }
    }

    return (
        <div>
            <FileUpload
                endpoint="courseImage"
                onChange={(url) => {
                    if (url) {
                        onSubmit({ imageUrl: url })
                    }
                }}
            />
            <div className="text-xs text-muted-foreground mt-4">
                16:9 aspect ratio recommended
            </div>
        </div>
    );
};



