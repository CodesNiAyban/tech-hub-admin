
import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PUT(
    req: Request,
    { params }: { params: { chapterId: string; courseId: string } }
) {
    try {
        const { sessionClaims, userId } = auth();
        const { isCompleted } = await req.json();

        if (sessionClaims?.metadata.role !== "admin") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const userProgress = await db.userProgress.upsert({
            where: {
                userId_chapterId: {
                    userId,
                    chapterId: params.chapterId,
                },
            },
            update: {
                isCompleted,
            },
            create: {
                userId,
                chapterId: params.chapterId,
                isCompleted,
            },
        });
        return NextResponse.json(userProgress);
    } catch (error) {
        console.log("[CHAPTER_ID_PROGRESS_ERROR]", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}