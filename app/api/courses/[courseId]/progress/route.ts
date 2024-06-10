import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        const { userId } = auth();
        const { unenrolledUserId } = await req.json();
        const courseId = params?.courseId; // Ensure courseId is properly extracted

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!courseId) {
            return new NextResponse("Invalid courseId", { status: 400 });
        }
        
        return new NextResponse("UserProgress deleted successfully", { status: 200 });

    } catch (error) {
        console.error("[COURSE_ID_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
