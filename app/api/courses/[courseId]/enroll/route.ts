import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PUT(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        const { sessionClaims, userId } = auth();

        if (sessionClaims?.metadata.role !== "admin") {
            return new NextResponse("Unathorized", { status: 401 })
        }

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const course = await db.course.findUnique({
            where: {
                id: params.courseId,
                isPublished: true,
            },
            select: {
                chapters: true,
            },
        });

        await db.enrollees.create({
            data: {
                courseId: params.courseId,
                userId: userId,
            },
        });

        if (!course) {
            return new NextResponse("Course not found", { status: 404 });
        }

        const chapterId = course.chapters[0].id;

        // Check if user progress already exists
        const existingProgress = await db.userProgress.findFirst({
            where: {
                userId,
                chapterId,
            },
        });

        if (existingProgress) {
            return new NextResponse("User progress already exists", { status: 409 });
        }

        // Create new user progress
        await db.userProgress.create({
            data: {
                userId,
                chapterId,
            }
        });

        return new NextResponse("User enrolled successfully", { status: 200 });

    } catch (error) {
        console.error("[PUT_ERROR]", error);
        throw new Error("Failed to enroll user in course");
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        const { userId } = auth();

        const courseId = params.courseId; // Ensure courseId is properly extracted

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!courseId) {
            return new NextResponse("Invalid courseId", { status: 400 });
        }

        // Delete progress records for chapters not included in 'others'
        await db.userProgress.deleteMany({
            where: {
                userId: userId,
                chapter: {
                    course: {
                        id: courseId
                    },
                }
            },
        });

        await db.enrollees.delete({
            where: {
                userId_courseId: {
                    userId: userId,
                    courseId: courseId
                }
            }
        });

        return new NextResponse("UserProgress updated successfully", { status: 200 });

    } catch (error) {
        console.error("[COURSE_ID_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
