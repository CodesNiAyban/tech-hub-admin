"use client";

import { FileUpload } from "@/components/file-upload";
import { Course } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import * as z from "zod";
import { attachmentSchema } from "../../../_utils/form-validation";

interface EditAttachmentProps {
    initialData: Course;
    courseId: string;
    formLabel: string;
    toggleModal: () => void;
}

export const EditAttachmentForm = ({
    initialData,
    courseId,
    formLabel,
    toggleModal
}: EditAttachmentProps) => {
    const router = useRouter();

    const editAttachment = async (values: z.infer<typeof attachmentSchema> & { name: string }) => {
        try {
            const response = await axios.post(`/api/courses/${courseId}/attachments`, values);
            router.refresh();
            return response;
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            toggleModal();
        }
    };

    const onSubmit = async (values: z.infer<typeof attachmentSchema>, name: string) => {
        try {
            const response = toast.promise(
                editAttachment({ ...values, name }),
                {
                    loading: "Processing",
                    error: "An error occured, please try again later.",
                    success: "Attachment Added!"
                }
            );
            return response;
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <FileUpload
                endpoint="courseAttachments"
                onChange={(url, name) => {
                    if (url && name) {
                        onSubmit({ url: url }, name);
                    }
                }}
            />
            <div className="text-xs text-muted-foreground mt-4">
                Add anything your students might need to complete the course
            </div>
        </div>
    );
};
