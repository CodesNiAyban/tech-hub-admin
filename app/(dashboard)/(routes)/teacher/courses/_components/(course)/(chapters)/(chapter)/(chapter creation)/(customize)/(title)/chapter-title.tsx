import { Chapter, Course } from "@prisma/client";
import { EditChapterTitleDialog } from "./edit-chapter-title-dialog";

interface ChapterTitleProps {
    initialData: Chapter
    courseId: string;
    chapterId: string;
    toggleModal: () => void
}

export const ChapterTitle = ({
    toggleModal,
    initialData,
    courseId,
    chapterId,
}: ChapterTitleProps) => {
    return (
        <div className="grid gap-6">
            <div className="grid gap-3">
                <div className="font-medium flex items-center justify-between">
                    Chapter Title
                    <EditChapterTitleDialog
                        title={"Edit Title"}
                        formLabel={"New Chapter Title"}
                        description={"Set the title for this chapter. Click 'Save' when you're finished."}
                        initialData={initialData}
                        courseId={courseId}
                        toggleModal={toggleModal}
                        chapterId={chapterId}
                    />
                </div>
                <div className="border bg-muted/40 rounded-md p-2 px-3">
                    <div className="font-medium text-sm items-center justify-between">
                        {initialData.title}
                    </div>
                </div>
            </div>
        </div>
    );
}