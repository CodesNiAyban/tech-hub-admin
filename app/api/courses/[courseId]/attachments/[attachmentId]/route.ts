import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";

export const utapi = new UTApi();

export async function DELETE(
    req: Request,
    { params }: { params: { courseId: string, attachmentId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unathorized", { status: 401 });
        }

        const courseOwner = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId
            }
        });

        if (!courseOwner) {
            return new NextResponse("Course Owner Not Found", { status: 500 });

        }

        const attachment = await db.attachment.findUnique({
            where: {
                courseId: params.courseId,
                id: params.attachmentId,
            }
        })

        if (!attachment) {
            return new NextResponse("Attachement Not Found", { status: 500 });
        }

        await utapi.deleteFiles(attachment?.name!);

        const deleteAttachement = await db.attachment.delete({
            where: {
                courseId: params.courseId,
                id: params.attachmentId,
            }
        })

        if (!deleteAttachement) {
            return new NextResponse("Delete Attachement Failed", { status: 500 });
        }

        return NextResponse.json(deleteAttachement);
    } catch (error) {
        console.log("ATTACTMENT_ID", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}