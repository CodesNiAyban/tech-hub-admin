import { Category, Course } from "@prisma/client";
import { EditCategoriesDialog } from "./edit-categories-dialog";
import { Badge } from "@/components/ui/badge";

interface CourseCategoriesProps {
    initialData: Course & { categories: Category[] };
    courseId: string;
    toggleModal: () => void
    categories: {
        id: string;
        name: string;
    }[]
}

export const CourseCategories = ({
    toggleModal,
    initialData,
    courseId,
    categories
}: CourseCategoriesProps) => {
    return (
        <div className="grid gap-6 pt-6">
            <div className="grid gap-3">
                <div className="font-medium flex items-center justify-between">
                    Course Categories
                    <EditCategoriesDialog
                        title={initialData.categories.length > 0 ? "Edit Categories" : "Add Categories"}
                        formLabel={"New Course Categories"}
                        description={"Set the categories for this course. Click 'Save' when you're finished."}
                        categories={categories}
                        initialData={initialData}
                        courseId={courseId}
                        toggleModal={toggleModal}
                    />
                </div>
                <div className="border bg-muted/40 rounded-md p-2 px-3">
                    <div className="font-medium flex">
                        {initialData.categories && initialData.categories.length > 0 ? (
                            initialData.categories.map((category) => (
                                <Badge key={category.id} variant="default" className="mr-2">{category.name}</Badge>
                            ))
                        ) : (
                            <p className="font-medium text-sm text-muted-foreground italic">Set the categories</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}