"use client"

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTransition } from 'react';

interface CourseActionsProps {
    isComplete: boolean;
    courseId: string;
    isPublished: boolean;
}

export const CourseActions = ({
    isComplete,
    courseId,
    isPublished,
}: CourseActionsProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const confetti = useConfettiStore();
    const [isPending, startTransition] = useTransition();

    const publishCourse = async () => {
        try {
            const response = await axios.patch(`/api/courses/${courseId}/publish`);
            startTransition(() => {
                router.refresh();
            });
            return response;
        } catch (error) {
            if (typeof error === 'string') {
                toast.error(error);
            } else {
                toast.error("An error occurred. Please try again later.");
            }
        }
    }

    const unpublishCourse = async () => {
        try {
            const response = await axios.patch(`/api/courses/${courseId}/unpublish`);
             startTransition(() => {
                router.refresh();
            });
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
                const response = unpublishCourse()
                toast.promise(response, {
                    loading: "Processing",
                    error: "An error occured, please try again later.",
                    success: "Course unpublished"
                });
            } else {
                const response = publishCourse()
                toast.promise(response, {
                    loading: "Processing",
                    error: "An error occured, please try again later.",
                    success: "Course published"
                });
                confetti.onOpen();
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false);
        }
    }

    const deleteCourse = async () => {
        try {
            const response = await axios.delete(`/api/courses/${courseId}`)
             startTransition(() => {
                router.refresh();
            });
            router.push(`/teacher/courses`)
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
            const response = deleteCourse();
            toast.promise(response, {
                loading: "Processing",
                error: "An error occured, please try again later.",
                success: "Course deleted"
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