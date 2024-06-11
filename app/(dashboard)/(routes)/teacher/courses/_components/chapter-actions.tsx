"use client"

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface ChapterActionsProps {
    isComplete: boolean;
    courseId: string;
    chapterId: string;
    isPublished: boolean;
}

export const ChapterActions = ({
    isComplete,
    courseId,
    chapterId,
    isPublished,
}: ChapterActionsProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();


    const publishChapter = async () => {
        try {
            const response = await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/publish`);
            router.refresh();
            return response;
        } catch (error) {
            if (typeof error === 'string') {
                toast.error(error);
            } else {
                toast.error("An error occurred. Please try again later.");
            }
        }
    }

    const unpublishChapter = async () => {
        try {
            const response = await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/unpublish`);
            router.refresh();
            return response;
        } catch (error) {
            if (typeof error === 'string') {
                toast.error(error);
            } else {
                toast.error("An error occurred. Please try again later.");
            }
        }
    }

    const onClick = async () => {
        try {
            setIsLoading(true);
            if (isPublished) {
                const response = unpublishChapter()
                toast.promise(response, {
                    loading: "Processing",
                    error: "An error occured, please try again later.",
                    success: "Chapter unpublished"
                });
            } else {
                const response = publishChapter()
                toast.promise(response, {
                    loading: "Processing",
                    error: "An error occured, please try again later.",
                    success: "Chapter published"
                });
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false);
        }
    }

    const deleteChapter = async () => {
        try {
            const response = await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`)
            router.refresh();
            router.push(`/teacher/courses/${courseId}`)
            return response;
        } catch (error) {
            if (typeof error === 'string') {
                toast.error(error);
            } else {
                toast.error("An error occurred. Please try again later.");
            }
        }
    }

    const onDelete = async () => {
        try {
            setIsLoading(true);
            const response = deleteChapter();
            toast.promise(response, {
                loading: "Processing",
                error: "An error occured, please try again later.",
                success: "Chapter deleted"
            });
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex items-center gap-x-2">
            <Button
                onClick={onClick}
                disabled={!isComplete || isLoading}
                variant="outline"
                size="sm"
            >
                {isPublished ? "Unpublish" : "Publish"}
            </Button>
            <ConfirmModal onConfirm={onDelete}>
                <Button size="sm" disabled={isLoading}>
                    <Trash className="h-4 w-4" />
                </Button>
            </ConfirmModal>
        </div>
    )
}