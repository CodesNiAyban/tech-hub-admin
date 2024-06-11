"use client"

import { FileUpload } from "@/components/file-upload";
import { Chapter, MuxData } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import * as z from "zod";
import { videoSchema } from "../../../../../_utils/form-validation";

interface EditVideoProps {
    initialData: Chapter & { muxData?: MuxData | null }
    courseId: string;
    chapterId: string
    formLabel: string
    toggleModal: () => void
}

export const EditVideoForm = ({
    initialData,
    courseId,
    formLabel,
    toggleModal,
    chapterId
}: EditVideoProps) => {
    const router = useRouter();

    const setVideo = async (values: z.infer<typeof videoSchema>) => {
        try {
            const response = await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
            router.refresh();
            return response;
        } catch (error) {
            console.log(error)
            throw error
        } finally {
            toggleModal()
        }
    };

    const onSubmit = async (values: z.infer<typeof videoSchema>) => {
        try {
            const response = toast.promise(
                setVideo(values),
                {
                    loading: "Processing",
                    error: "An error occured, please try again later.",
                    success: "Chapter Video Updated!"
                }
            );
            return response;
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
                endpoint="chapterVideo"
                onChange={(url) => {
                    if (url) {
                        onSubmit({ videoUrl: url })
                    }
                }}
            />
            <div className="text-xs text-muted-foreground mt-4">
                Upload this chapter&apos;s video
            </div>
            {initialData.videoUrl && (
                <div className="text-xs text-muted-foreground mt-2">
                    Videos can take a few minutes to process. Refresh the page if video does not appear
                </div>
            )}
        </div>
    );
};



