import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        const { userId } = auth();
        const { courseId } = params;
        const values = await req.json();
        console.log("[FIASDILK]", values)

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Check if the course exists and the user is the owner
        const courseOwner = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId,
            }
        });

        if (!courseOwner) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const updatedCourse = await db.course.update({
            where: {
                id: courseId,
                userId
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
