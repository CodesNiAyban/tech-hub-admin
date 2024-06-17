import { Chapter, Course } from "@prisma/client";
import { EditChapterAccessDialog } from "./set-chapter-access-dialog";
import { cn } from "@/lib/utils";
import { Preview } from "@/components/preview";
import { Badge } from "@/components/ui/badge";

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
                <div className="font-medium flex items-center">
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
                    <div className="font-medium flex items-center">
                        <p className={cn("text-sm",
                            !initialData.subscription && "font-medium text-sm text-muted-foreground italic",
                            initialData.subscription !== null && "font-medium text-sm text-muted-foreground italic"
                        )}>
                            {initialData.subscription === "null" ? (
                                <>This chapter is <Badge variant="muted" className="ml-1 mr-1">FREE</Badge> for preview </>
                            ) : (
                                <>
                                    {
                                        initialData.subscription === "PRO" ? (
                                            <div className="flex">This chapter is only available to <Badge variant="success" className="ml-1 mr-1">PRO</Badge> and <Badge variant="yellow" className="ml-1 mr-1 text-purple-50">LIFETIME</Badge> users</div>
                                        ) : (
                                            <div className="flex">This chapter is only available to <Badge variant="default" className="ml-1 mr-1">BASIC</Badge> users</div>
                                        )
                                    }
                                </>
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}