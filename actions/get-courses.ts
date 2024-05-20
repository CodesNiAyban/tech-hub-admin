import { Category, Course } from "@prisma/client";

import { getProgress } from "@/actions/get-progress";
import { Categories } from "@/app/(dashboard)/(routes)/(browse)/_components/categories";
import db from "@/lib/db";

type CourseWithProgressWithCategory = Course & {
    categories: Category[] | null;
    chapters: { id: string }[];
    progress?: number | null; // Make progress property optional
};

type GetCourses = {
    userId?: string;
    title?: string;
    categoryId?: string; // Maybe this will be a culprit in array category search
};

export const getCourses = async ({
    userId,
    title,
    categoryId,
}: GetCourses): Promise<CourseWithProgressWithCategory[]> => {
    try {
        const courses = await db.course.findMany({
            where: {
                isPublished: true,
                title: {
                    contains: title,
                },
                categories: {
                    some: {
                        id: categoryId
                    }
                }
            },
            include: {
                categories: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                chapters: {
                    where: {
                        isPublished: true,
                    },
                    select: {
                        id: true,
                    }
                },
                purchases: {
                    where: {
                        userId,
                    },
                    select: {
                        id: true, // Include only the fields that actually exist
                    }
                }
            },
            orderBy: {
                createdAt: "desc",
            }
        });

        if (userId) {
            const coursesWithProgress: CourseWithProgressWithCategory[] = await Promise.all(
                courses.map(async course => {
                    if (course.purchases.length === 0) {
                        return {
                            ...course,
                            progress: null,
                        }
                    }

                    const progressPercentage = await getProgress(userId, course.id);

                    return {
                        ...course,
                        progress: progressPercentage,
                    };
                })
            );

            return coursesWithProgress;
        } else {
            return courses.map(course => ({
                ...course,
                progress: null,
            }));
        }
    } catch (error) {
        console.log("[GET_COURSES]: ", error);
        return [];
    }
}
