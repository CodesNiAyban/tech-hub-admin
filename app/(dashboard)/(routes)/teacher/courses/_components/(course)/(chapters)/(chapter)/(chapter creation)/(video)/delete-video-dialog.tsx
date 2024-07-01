import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import axios from "axios";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface DeleteVideoDialogProps {
    courseId: string;
    chapterId: string;
}

export const DeleteVideoDialog = ({
    courseId,
    chapterId
}: DeleteVideoDialogProps) => {
    const router = useRouter();

    const onDelete = async (id: string) => {
        try {
            const response = deleteVideo(id);
            toast.promise(response, {
                loading: "Processing",
                error: "An error occured, please try again later.",
                success: "Video removed"
            });
        } catch (error) {
            throw Error
        }
    }

    const deleteVideo = async (id: string) => {
        try {
            const response = await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, {
                videoUrl: null
            });
            router.refresh();
            return response;
        } catch (error) {
            throw Error
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild data-testid="delete-video-{id}">
                <button
                    className="ml-auto hover:opacity-75 transition">
                    <X className="h-4 w-4" />
                </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        video.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel data-testid="cancel" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">Cancel</AlertDialogCancel>
                    <AlertDialogAction data-testid="proceed" asChild className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2">
                        <button onClick={() => onDelete(chapterId)}>
                            Continue
                        </button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
