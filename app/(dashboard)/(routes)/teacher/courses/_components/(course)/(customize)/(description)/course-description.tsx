import { cn } from "@/lib/utils";
import { EditDescriptionDialog } from "./edit-description-dialog";
import { Course } from "@prisma/client";

interface CourseDescriptionProps {
    initialData: Course
    courseId: string;
    toggleModal: () => void
}

export const CourseDescription = ({
    toggleModal,
    initialData,
    courseId,
}: CourseDescriptionProps) => {
    return (
        <div className="grid gap-6 pt-6">
            <div className="grid gap-3">
                <div className="font-medium flex items-center">
                    {initialData.description ? (<>Course Description</>) :
                        (<>Course Description <a className="text-destructive flex ml-1">*</a></>)
                    }
                    <EditDescriptionDialog
                        title={initialData.description ? "Edit Description" : "Add Description"}
                        formLabel={"New Course Description"}
                        description={"Set the description for this course. Click 'Save' when you're finished."}
                        initialData={initialData}
                        courseId={courseId}
                        toggleModal={toggleModal}
                    />
                </div>
                <div className="border bg-muted/40 rounded-md p-2 px-3">
                    <div className="font-medium flex items-center">
                        <p className={cn("text-sm ",
                            !initialData.description && "font-medium text-sm text-muted-foreground italic"
                        )}>
                            {initialData.description || "Enter a Description"}
                        </p>
                    </div>
                </div>
            </div>
        </div >
    );
}