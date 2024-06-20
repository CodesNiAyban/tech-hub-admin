import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        const { sessionClaims } = auth();
        const values = await req.json();
        const { courseId } = params;

        if (sessionClaims?.metadata.role !== "admin") {
            return new NextResponse("Unathorized", { status: 401 });
        }

        // Check if the course exists and the user is the owner
        const courseOwner = await db.course.findUnique({
            where: {
                id: courseId,
            }
        });

        if (!courseOwner) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const updatedCourse = await db.course.update({
            where: {
                id: courseId,
            },
            data: {
                categories: {
                    set: values.categories.map((categoryId: string) => ({ id: categoryId })),
                },
            },
        });


        return NextResponse.json(updatedCourse);
    } catch (error) {
        console.error("[COURSE_CATEGORY_ASSOCIATION_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
