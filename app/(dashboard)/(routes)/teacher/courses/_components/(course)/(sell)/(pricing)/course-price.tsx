import { cn } from "@/lib/utils";
import { EditPriceDialog } from "./set-price-dialog";
import { Course } from "@prisma/client";
import { formatPrice } from "@/lib/format"

interface CoursePriceProps {
    initialData: Course
    courseId: string;
    toggleModal: () => void
}

export const EditCoursePrice = ({
    toggleModal,
    initialData,
    courseId,
}: CoursePriceProps) => {
    return (
        <div className="grid gap-6">
            <div className="grid gap-3">
                <div className="font-medium flex items-center justify-between">
                    Course Price
                    <EditPriceDialog
                        title={initialData.price ? "Edit Price" : "Set Price"}
                        formLabel={"New Course Price"}
                        description={"Set the price for this course. Click 'Save' when you're finished."}
                        initialData={initialData}
                        courseId={courseId}
                        toggleModal={toggleModal}
                    />
                </div>
                <div className="border bg-muted/40 rounded-md p-2 px-3">
                    <div className="font-medium flex items-center justify-between">
                        <p className={cn("text-sm",
                            !initialData.price && "font-medium text-sm text-muted-foreground italic"
                        )}>
                            {initialData.price
                                ? formatPrice(initialData.price)
                                : "Set the Price"}
                        </p>
                    </div>
                </div>
            </div>
        </div >
    );
}