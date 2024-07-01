"use client"

import { UnenrollConfirmModal } from "@/components/modals/unenroll-confirm-modal";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { BadgeX } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export const maxDuration = 60;

interface UserActionsProps {
    courseId: string;
    userId: string;
}

export const UserActions = ({
    courseId,
    userId
}: UserActionsProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const deleteCourseProgress = async () => {
        try {
            const response = await axios.delete(`/api/courses/${courseId}/progress`, { data: {  unenrolledUserId: userId } });
            router.refresh();
            return response;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    const onDelete = async () => {
        try {
            setIsLoading(true);
            const response = toast.promise(deleteCourseProgress(), {
                loading: "Processing",
                error: "An error occurred, please try again later.",
                success: "User Unenrolled!"
            });
            return response;
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <UnenrollConfirmModal onConfirm={onDelete}>
            <Button size="sm" disabled={isLoading} variant="ghost" className="flex items-left justify-start" data-testid="unenroll-student-{id}">
                <BadgeX className="h-4 w-4 mr-2" />
                Unenroll
            </Button>
        </UnenrollConfirmModal>
    )
}