import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import Mux from "@mux/mux-node";
import { NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";

export const utapi = new UTApi();

const mux = new Mux({
    tokenId: process.env.MUX_TOKEN_ID!,
    tokenSecret: process.env.MUX_TOKEN_SECRET!,
})

export async function DELETE(
    req: Request,
    { params }: {
        params: {
            courseId: string;
            chapterId: string
        }
    }
) {
    try {
        const { sessionClaims } = auth();

        if (sessionClaims?.metadata.role !== "admin") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const courseOwner = await db.course.findUnique({
            where: {
                id: params.courseId,
            }
        });

        if (!courseOwner) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const chapter = await db.chapter.findUnique({
            where: {
                id: params.chapterId,
                courseId: params.courseId,
            }
        });


        if (!chapter) {
            return new NextResponse("Chapter Not Found", { status: 404 });
        }

        if (chapter.videoUrl) {
            const existingMuxData = await db.muxData.findFirst({
                where: {
                    chapterId: params.chapterId
                }
            })

            if (existingMuxData) {
                await mux.video.assets.delete(existingMuxData.assetId);
                await utapi.deleteFiles(chapter.videoUrl.split("/").pop() || "");
                await db.muxData.delete({
                    where: {
                        id: existingMuxData.id,
                    }
                });
            }
        }

        const deletedChapter = await db.chapter.delete({
            where: {
                id: params.chapterId
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
                    isPublished: false,
                }
            })
        }

        return NextResponse.json(deletedChapter)
    } catch (error) {
        console.log("[CHAPTER_ID_DELETE", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string; chapterId: string } }
) {
    try {
        const { sessionClaims } = auth();
        const { isPublished, ...values } = await req.json();

        if (sessionClaims?.metadata.role !== "admin") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (values.videoUrl) {
            const prevChapter = await db.chapter.findUnique({
                where: {
                    id: params.chapterId,
                    courseId: params.courseId,
                },
            });

            if (prevChapter?.videoUrl) {
                const videoName = prevChapter.videoUrl.split("/").pop(); // this is the previous video to be deleted
                if (videoName) await utapi.deleteFiles(videoName!); // strictly check if videoname exists
            }
        }

        const chapter = await db.chapter.update({
            where: {
                id: params.chapterId,
                courseId: params.courseId,
            },
            data: {
                ...values,
            },
        });

        if (values.videoUrl) {
            const existingMuxData = await db.muxData.findFirst({
                where: {
                    chapterId: params.chapterId,
                },
            });

            if (existingMuxData) {
                // cleanup function if user changes video
                await mux.video.assets.delete(existingMuxData.assetId);
                await db.muxData.delete({
                    where: {
                        id: existingMuxData.id,
                    },
                });
            }
            //if user never uploaded any video
            //then create asset
            const asset = await mux.video.assets.create({
                input: values.videoUrl,
                playback_policy: ["public"],
                test: false,
            });

            await db.muxData.create({
                data: {
                    assetId: asset.id,
                    chapterId: params.chapterId,
                    playbackId: asset.playback_ids?.[0]?.id,
                },
            });
        }

        return NextResponse.json(chapter);
    } catch (error) {
        console.log("[COURSES_CHAPTER_ID", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}