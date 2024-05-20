import { Chapter, Course } from "@prisma/client";
import { EditChapterDescriptionDialog } from "./edit-chapter-desciption-dialog";
import { cn } from "@/lib/utils";
import { Preview } from "@/components/preview";

interface ChapterDescriptionProps {
    initialData: Chapter;
    courseId: string;
    chapterId: string;
    toggleModal: () => void
}

export const ChapterDescription = ({
    toggleModal,
    initialData,
    courseId,
    chapterId,
}: ChapterDescriptionProps) => {
    return (
        <div className="grid gap-6 pt-6">
            <div className="grid gap-3">
                <div className="font-medium flex items-center justify-between">
                    Chapter Description
                    <EditChapterDescriptionDialog
                        title={initialData.description ? "Edit Description" : "Add Description"}
                        formLabel={"New Chapter Description"}
                        description={"Set the description for this chapter. Click 'Save' when you're finished."}
                        initialData={initialData}
                        courseId={courseId}
                        toggleModal={toggleModal}
                        chapterId={chapterId}
                    />
                </div>
                <div className="border bg-muted/40 rounded-md p-2 px-3">
                    <div className="font-medium flex items-center justify-between">
                        <div className={cn("text-sm ",
                            !initialData.description && "font-medium text-sm text-muted-foreground italic"
                        )}>
                            {!initialData.description && "No description"}
                            {initialData.description && (
                                <Preview
                                    value={initialData.description}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}