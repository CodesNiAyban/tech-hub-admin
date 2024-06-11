import { Course } from "@prisma/client";
import { EditTitleDialog } from "./edit-code-dialog";
import { cn } from "@/lib/utils";

interface CourseCodeProps {
    initialData: Course
    courseId: string;
    toggleModal: () => void
}

export const CourseCode = ({
    toggleModal,
    initialData,
    courseId,
}: CourseCodeProps) => {
    return (
        <div className="grid gap-6">
            <div className="grid gap-3">
                <div className="font-medium flex items-center justify-between">
                    Course Code
                    <EditTitleDialog
                        title={"Edit Title"}
                        formLabel={"New Course Title"}
                        description={"Set the title for this course. Click 'Save' when you're finished."}
                        initialData={initialData}
                        courseId={courseId}
                        toggleModal={toggleModal}
                    />
                </div>
                <div className="border bg-muted/40 rounded-md p-2 px-3">
                    <div className="font-medium flex items-center justify-between">
                        <p className={cn("text-sm",
                            !initialData.code && "font-medium text-sm text-muted-foreground italic"
                        )}>
                            {initialData.code || "Enter a Course Code"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}