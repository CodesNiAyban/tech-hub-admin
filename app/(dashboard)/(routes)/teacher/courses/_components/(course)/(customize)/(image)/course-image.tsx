import { cn } from "@/lib/utils";
import { EditImageDialog } from "./set-image-dialog";
import { Course } from "@prisma/client";
import { ImageIcon } from "lucide-react";
import Image from "next/image"

interface CourseImageProps {
    initialData: Course;
    courseId: string;
    toggleModal: () => void
}

export const CourseImage = ({
    toggleModal,
    initialData,
    courseId,
}: CourseImageProps) => {
    return (
        <div className="grid gap-6 pt-6">
            <div className="grid gap-3">
                <div className="font-medium flex items-center">
                    {initialData.imageUrl ? (<>Course Image</>) :
                        (<>Course Image <a className="text-destructive flex ml-1">*</a></>)
                    }
                    <EditImageDialog
                        title={initialData.imageUrl ? "Replace Image" : "Add an Image"}
                        formLabel={"Image"}
                        description={"Set the image for this course. Click 'Save' when you're finished."}
                        initialData={initialData}
                        courseId={courseId}
                        toggleModal={toggleModal}
                    />
                </div>
                {!initialData.imageUrl ? (
                    <div className="flex items-center justify-center border h-60 bg-muted/40 rounded-md p-2 px-3">
                        <ImageIcon className="h-10 w-10 text-muted-foreground" />
                    </div>
                ) : (
                    <div className="relative aspect-video mt-2">
                        <Image
                            alt="upload"
                            fill
                            className="object-cover rounded-md"
                            src={initialData.imageUrl}
                        />
                    </div>
                )}
            </div>
        </div >
    );
}