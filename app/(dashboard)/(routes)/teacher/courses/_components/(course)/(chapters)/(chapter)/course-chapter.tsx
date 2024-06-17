import { cn } from "@/lib/utils";
import { EditChapterDialog } from "./edit-chapter-dialog";
import { Chapter, Course } from "@prisma/client";
import { ChaptersList } from "./chapters-list";
import toast from "react-hot-toast";
import axios from "axios";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface CourseChapterProps {
    initialData: Course & { chapters: Chapter[] };
    courseId: string;
    toggleModal: () => void
}

export const CourseChapter = ({
    toggleModal,
    initialData,
    courseId,
}: CourseChapterProps) => {
    const [isUpdating, setIsUpdating] = useState(false)
    const router = useRouter();
    const reorderChapter = async (updateData: { id: string; position: number }[]) => {

        try {
            setIsUpdating(true)
            const response = await axios.put(`/api/courses/${courseId}/chapters/reorder`,
                {
                    list: updateData
                });
            return response;
        } catch (error) {
            if (typeof error === 'string') {
                toast.error(error);
            } else {
                toast.error("An error occurred. Please try again later.");
            }
        } finally {
            setIsUpdating(false)
        }
    };

    const onReorder = async (updateData: { id: string; position: number }[]) => {
        try {
            const response = reorderChapter(updateData);
            toast.promise(response, {
                loading: "Processing",
                error: "An error occured, please try again later.",
                success: "Chapters successfully reordered"
            });

        } catch (error) {
            console.log(error)
        }
    }

    const onEdit = async (id: string) => {
        router.push(`/teacher/courses/${courseId}/chapters/${id}`);
    }

    return (
        <div className="grid gap-6">
            <div className="grid gap-3">
                <div className="font-medium flex items-center">
                    {initialData.chapters.some(chapter => chapter.isPublished) ? (<>Course Chapters</>) :
                        (<>Course Chapters <a className="text-destructive text-xs flex ml-1">(Must publish atleast one chapter)</a></>)
                    }
                    <EditChapterDialog
                        title={"Add a Chapter"}
                        formLabel={"New Course Chapter"}
                        description={"Add a new chapter for this course. Click 'Save' when you're finished."}
                        initialData={initialData}
                        courseId={courseId}
                        toggleModal={toggleModal}
                    />
                </div>
                <div className="relative border root:bg-slate-100 dark:bg-muted/40 rounded-md p-4">
                    {isUpdating && (
                        <div className="absolute h-full w-full top-0 right-0 rounded-md flex items-center justify-center z-50 bg-opacity-75 backdrop-filter backdrop-blur-sm">
                            <Loader2 className="animate-spin h-6 w-6 text-primary" />
                        </div>
                    )}
                    <div className="font-medium text-sm items-center justify-between">
                        {!initialData.chapters.length ? (
                            <p className="font-medium text-sm text-muted-foreground italic">Add a chapter</p>
                        ) : (
                            <ChaptersList
                                onEdit={onEdit}
                                onReorder={onReorder}
                                items={initialData.chapters || []}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
}