import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        const { sessionClaims } = auth();

        // If the user does not have the admin role, redirect them to the home page
        if (sessionClaims?.metadata.role !== "admin") {
            return new NextResponse("Unathorized", { status: 401 })
        }

        const course = await db.course.findUnique({
            where: {
                id: params.courseId,
            },
        });

        if (!course) {
            return new NextResponse("Not found", { status: 404 })
        }

        const unpublishedCourse = await db.course.update({
            where: {
                id: params.courseId,
            },
            data: {
                isPublished: false,
            }
        })

        return NextResponse.json(unpublishedCourse);
    } catch (error) {
        console.log("[COURSE_ID_UNPUBLISH]", error)
        return new NextResponse("Internal Error", { status: 500 });
    }
}