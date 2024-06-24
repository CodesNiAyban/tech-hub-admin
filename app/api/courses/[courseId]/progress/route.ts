import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

interface ProgressData {
    chapterId: string;
    // Add other properties if needed
}

export async function DELETE(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        const { sessionClaims, userId } = auth();

        if (sessionClaims?.metadata.role !== "admin") {
            return new NextResponse("Unathorized", { status: 401 })
        }
        const { unenrolledUserId } = await req.json(); // Assuming 'others' contains the progress data to keep

        const courseId = params.courseId; // Ensure courseId is properly extracted

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!courseId) {
            return new NextResponse("Invalid courseId", { status: 400 });
        }

        console.log(courseId)
        // Delete progress records for chapters not included in 'others'
        await db.userProgress.deleteMany({
            where: {
                userId: unenrolledUserId,
                chapter: {
                    course: {
                        id: courseId
                    }
                }
            },
        });

        await db.enrollees.delete({
            where: {
                userId_courseId: {
                    courseId: courseId,
                    userId: userId,
                }
            }
        });

        return new NextResponse("UserProgress updated successfully", { status: 200 });

    } catch (error) {
        console.error("[COURSE_ID_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
