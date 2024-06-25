import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Mux from "@mux/mux-node";
import { UTApi } from "uploadthing/server";

export const utapi = new UTApi();


const mux = new Mux({
    tokenId: process.env.MUX_TOKEN_ID!,
    tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function DELETE(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        const { sessionClaims } = auth();


        if (sessionClaims?.metadata.role !== "admin") {
            return new NextResponse("Unathorized", { status: 401 })
        }

        const course = await db.course.findUnique({
            where: {
                id: params.courseId,
            },
            include: {
                chapters: {
                    include: {
                        muxData: true,
                    }
                },
                attachments: true,
            }
        });

        if (!course) {
            return new NextResponse("Not Found", { status: 404 });
        }

        for (const chapter of course.chapters) {
            if (chapter?.muxData?.assetId) {
                await mux.video.assets.delete(chapter.muxData!.assetId);
            }
        }

        for (const attachment of course.attachments) {
            await utapi.deleteFiles(attachment?.name!);
            await db.attachment.delete({
                where: {
                    id: attachment.id,
                }
            });
        }

        if (course.imageUrl) await utapi.deleteFiles(course.imageUrl.split("/").pop() || "");

        const deletedCourse = await db.course.delete({
            where: {
                id: params.courseId
            },
        });

        return NextResponse.json(deletedCourse);
    } catch (error) {
        console.log("[COURSE_ID_DELETE]", error)
        return new NextResponse("Internal Error", { status: 500 });
    }
}
export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        const { sessionClaims } = auth();
        const { courseId } = params;
        const values = await req.json();

        if (sessionClaims?.metadata.role !== "admin") {
            return new NextResponse("Unathorized", { status: 401 })
        }

        if (values.title) {
            const existingCourseByTitle = await db.course.findUnique({
                where: {
                    title: values.title,
                },
            });

            if (existingCourseByTitle && existingCourseByTitle.id !== courseId) {
                return new NextResponse("Title must be unique", { status: 403 });
            }
        }

        const currentCourse = await db.course.findUnique({
            where: {
                id: courseId,
            }
        });

        if (!currentCourse) {
            return new NextResponse("Course Not Found", { status: 404 });
        }

        if (values.imageUrl) {
            if (currentCourse.imageUrl) {
                await utapi.deleteFiles(currentCourse.imageUrl.split("/").pop() || "");
            }
        }

        const course = await db.course.update({
            where: {
                id: courseId,
            },
            data: {
                ...values,
            }
        });

        return NextResponse.json(course);
    } catch (error) {
        console.log("[COURSE_ID]", error)
        return new NextResponse("Internal Error", { status: 500 });
    }
}