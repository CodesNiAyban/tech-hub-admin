"use client"

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import axios from "axios";
import { BookCheck, BookDashed, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export const maxDuration = 60;

interface CourseActionsProps {
    isComplete: boolean;
    courseId: string;
    isPublished: boolean;
}

export const CourseTableActions = ({
    isComplete,
    courseId,
    isPublished,
}: CourseActionsProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const confetti = useConfettiStore();

    const publishCourse = async () => {
        try {
            const response = await axios.patch(`/api/courses/${courseId}/publish`);
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

    const unpublishCourse = async () => {
        try {
            const response = await axios.patch(`/api/courses/${courseId}/unpublish`);
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
                const response = unpublishCourse();
                toast.promise(response, {
                    loading: "Processing",
                    error: "An error occurred, please try again later.",
                    success: "Course unpublished"
                });
            } else {
                const response = publishCourse();
                toast.promise(response, {
                    loading: "Processing",
                    error: "An error occurred, please try again later.",
                    success: "Course published"
                });
                confetti.onOpen();
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    const deleteCourse = async () => {
        try {
            const response = await axios.delete(`/api/courses/${courseId}`);
            router.refresh();
            router.push(`/teacher/courses`);
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
            router.refresh();
            toast.promise(response, {
                loading: "Processing",
                error: "An error occurred, please try again later.",
                success: "Course deleted"
            });
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <Button
                onClick={onClick}
                disabled={!isComplete || isLoading}
                variant="ghost"
                size="sm"
                className="flex justify-start"
            >
                {isPublished ? (
                    <>
                        <BookDashed className="h-4 w-4 mr-2" />
                        Unpublish
                    </>
                ) : (
                    <>
                        <BookCheck className="h-4 w-4 mr-2" />
                        Publish
                    </>
                )}
            </Button>
            <ConfirmModal onConfirm={onDelete}>
                <Button size="sm" disabled={isLoading} variant="ghost" className="flex items-left justify-start">
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                </Button>
            </ConfirmModal>
        </>
    )
}
