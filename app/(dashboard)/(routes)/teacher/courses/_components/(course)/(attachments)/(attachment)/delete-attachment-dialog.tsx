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
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

interface DeleteAttachmentDialogProps {
    attachmentId: string,
    courseId: string;
}

export const DeleteAttachmentDialog = ({
    attachmentId,
    courseId
}: DeleteAttachmentDialogProps) => {
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const router = useRouter();

    const onDelete = async (id: string) => {
        try {
            const response = deleteAttachment(id);
            toast.promise(response, {
                loading: "Processing",
                error: "An error occured, please try again later.",
                success: "Attachment removed"
            });
        } catch (error) {
            throw Error
        } finally {
            setDeletingId(null);
        }
    }

    const deleteAttachment = async (id: string) => {
        try {
            setDeletingId(id);
            const response = await axios.delete(`/api/courses/${courseId}/attachments/${id}`)
            router.refresh();
            return response;
        } catch (error) {
            throw Error
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
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
                        attachment.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel data-testid="cancel" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">Cancel</AlertDialogCancel>
                    <AlertDialogAction data-testid="proceed" asChild className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2">
                        <button onClick={() => onDelete(attachmentId)}>
                            Continue
                        </button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
