
import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CustomizeCourse } from "../_components/(course)/(customize)/course-customize";
import { CourseChapters } from "../_components/(course)/(chapters)/course-chapters";
import { CoursePrice } from "../_components/(course)/(sell)/course-price";
import { CourseAttachment } from "../_components/(course)/(attachments)/course-attachments";
import { Banner } from "@/components/banner";
import { CourseActions } from "../../_components/course-actions";

export const maxDuration = 60;

const CourseIdPage = async ({
    params
}: {
    params: { courseId: string }
}) => {
    const { userId } = auth();

    if (!userId) {
        return redirect("/")
    }

    const course = await db.course.findUnique({
        where: {
            id: params.courseId,
            userId
        },
        include: {
            chapters: {
                orderBy: {
                    position: "asc"
                }
            },
            categories: {
                orderBy: {
                    name: "desc"
                }
            },
            attachments: {
                orderBy: {
                    createdAt: "desc"
                }
            }
        },
    })

    if (!course) {
        return redirect("/teacher/course"); // TODO: Add toast that course not found
    }

    const categories = await db.category.findMany({
        orderBy: {
            name: "asc",
        }
    })

    const requiredFields = [
        course.title,
        course.code,
        course.description,
        course.imageUrl,
        course.categories.length > 0,
        course.chapters.some(chapter => chapter.isPublished),
    ]

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length

    const completionText = `(${completedFields}/${totalFields})`

    const isComplete = requiredFields.every(Boolean);
    return (
        <div className="mt-16 sm:mt-16 md:mt-[56px] lg:mt-[60px]">
            {!course.isPublished && (
                <Banner
                    variant="warning"
                    label="This course is not published and will not be visible to the students"
                />
            )}
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-2">
                        <h1 className="text-2xl font-medium">
                            Course Setup
                        </h1>
                        <span className="text-sm root:text-slate-700">
                            Complete all fields {completionText}
                        </span>
                    </div>
                    <CourseActions
                        isComplete={isComplete}
                        courseId={params.courseId}
                        isPublished={course.isPublished}
                    />
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
                    <div>
                        <div className="flexcenter gap-x-2">
                            <CustomizeCourse
                                initialData={course}
                                courseId={course.id}
                                categories={categories}
                            />
                        </div>
                    </div>
                    <div>
                        <div className="flexcenter gap-x-2">
                            <CourseChapters
                                initialData={course}
                                courseId={course.id}
                            />
                            <CoursePrice
                                initialData={course}
                                courseId={course.id}
                            />
                            <CourseAttachment
                                initialData={course}
                                courseId={course.id}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CourseIdPage;