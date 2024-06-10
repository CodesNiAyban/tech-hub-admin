import { Category, Course } from "@prisma/client";

import { getProgress } from "@/app/actions/get-progress";
import db from "@/lib/db";

type CourseWithProgressWithCategory = Course & {
    categories: Category[] | null;
    chapters: { id: string }[];
    progress?: number | null; // Make progress property optional
};

type GetCourses = {
    userId?: string;
    title?: string;
    categoryId?: string; 
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
                        id: true, 
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
