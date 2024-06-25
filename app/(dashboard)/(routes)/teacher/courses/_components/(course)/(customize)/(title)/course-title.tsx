import { Course } from "@prisma/client";
import { EditTitleDialog } from "./edit-title-dialog";

interface CourseTitleProps {
    initialData: Course
    courseId: string;
    toggleModal: () => void
}

export const CourseTitle = ({
    toggleModal,
    initialData,
    courseId,
}: CourseTitleProps) => {
    return (
        <div className="grid gap-6">
            <div className="grid gap-3">
                <div className="font-medium flex items-center">
                    Course Title
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
                    <div className="text-sm flex items-center justify-between">
                        {initialData.title}
                    </div>
                </div>
            </div>
        </div>
    );
}