"use client";

import { FileUpload } from "@/components/file-upload";
import { Chapter } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import * as z from "zod";
import { moduleSchema } from "../../../../../../_utils/form-validation";


interface EditModuleProps {
    initialData: Chapter;
    courseId: string;
    chapterId: string;
    formLabel: string;
    toggleModal: () => void;
}

export const EditModuleForm = ({
    initialData,
    chapterId,
    formLabel,
    toggleModal,
    courseId
}: EditModuleProps) => {
    const router = useRouter();

    const editModule = async (values: z.infer<typeof moduleSchema>) => {
        try {
            const response = await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
            router.refresh();
            return response;
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            toggleModal();
        }
    };

    const onSubmit = async (values: z.infer<typeof moduleSchema>) => {
        try {
            const response = toast.promise(
                editModule({ ...values }),
                {
                    loading: "Processing",
                    error: "An error occured, please try again later.",
                    success: "Module Added!"
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
                endpoint="chapterModule"
                onChange={(url) => {
                    if (url) {
                        onSubmit({ pdfUrl: url });
                    }
                }}
            />
            <div className="text-xs text-muted-foreground mt-4">
                Add anything your students might need to complete the Chapter
            </div>
        </div>
    );
};
