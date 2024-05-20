import { Chapter, Course } from "@prisma/client";
import { EditChapterAccessDialog } from "./set-chapter-access-dialog";
import { cn } from "@/lib/utils";
import { Preview } from "@/components/preview";

interface ChapterAccessProps {
    initialData: Chapter;
    courseId: string;
    chapterId: string;
    toggleModal: () => void
}

export const ChapterAccess = ({
    toggleModal,
    initialData,
    courseId,
    chapterId,
}: ChapterAccessProps) => {
    return (
        <div className="grid gap-6">
            <div className="grid gap-3">
                <div className="font-medium flex items-center justify-between">
                    Chapter Access
                    <EditChapterAccessDialog
                        title={"Set Access"}
                        formLabel={"Set Chapter Access"}
                        description={"Set the access for this chapter. Click 'Save' when you're finished."}
                        initialData={initialData}
                        courseId={courseId}
                        toggleModal={toggleModal}
                        chapterId={chapterId}
                    />
                </div>
                <div className="border bg-muted/40 rounded-md p-2 px-3">
                    <div className="font-medium flex items-center justify-between">
                        <p className={cn("text-sm",
                            !initialData.isFree && "font-medium text-sm text-muted-foreground italic"
                        )}>
                            {initialData.isFree ? (
                                <>This chapter is free for preview</>
                            ) : (
                                <>This chapter is paid</>
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}