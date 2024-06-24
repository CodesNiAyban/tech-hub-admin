import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: {
        params: {
            courseId: string;
            chapterId: string;

        }
    }
) {
    try {
         const { sessionClaims } = auth();

        if (sessionClaims?.metadata.role !== "admin") {
            return new NextResponse("Unathorized", { status: 401 });
        }

        const unpublishChapter = await db.chapter.update({
            where: {
                id: params.chapterId,
                courseId: params.courseId,
            },
            data: {
                isPublished: false,
            }
        });

        const publishedChaptersInCourse = await db.chapter.findMany({
            where: {
                courseId: params.courseId,
                isPublished: true,
            }
        });

        if (!publishedChaptersInCourse.length) {
            await db.course.update({
                where: {
                    id: params.courseId,
                },
                data: {
                    isPublished: false
                }
            });
        }

        return NextResponse.json(unpublishChapter);
    } catch (error) {
        console.log("[CHAPTER_UNPUBLISH", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}