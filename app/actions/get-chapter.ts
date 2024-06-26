import db from "@/lib/db";
import { Attachment, Chapter } from "@prisma/client";

interface GetChapterProps {
    userId: string;
    courseId: string;
    chapterId: string;
}

export const getChapter = async ({
    userId,
    courseId,
    chapterId,
}: GetChapterProps) => {
    try {
        // Check if the user has purchased the course
        const purchase = await db.purchase.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId,
                },
            },
        });

        // Fetch the course details
        const course = await db.course.findUnique({
            where: {
                id: courseId,
                isPublished: true,
            },
            select: {
                id: true,
                price: true,
                chapters: {
                    select: {
                        id: true,
                        position: true,
                        subscription: true,
                        pdfUrl: true,
                        userProgress: {
                            where: {
                                userId,
                            },
                            select: {
                                isCompleted: true,
                                userId: true,
                            },
                        },
                        comments: {
                            select: {
                                id: true,
                                comment: true,
                            },
                        },
                    },
                    orderBy: {
                        position: 'asc',
                    },
                },
            },
        });

        if (!course) {
            throw new Error("Course not found or not published");
        }

        // Fetch the chapter details
        const chapter = await db.chapter.findUnique({
            where: {
                id: chapterId,
                isPublished: true,
            },
        });

        if (!chapter) {
            throw new Error("Chapter not found or not published");
        }

        let muxData = null;
        let attachments: Attachment[] = [];
        let nextChapter: Chapter | null = null;

        // Fetch attachments if the user has purchased the course
        if (chapter.subscription || purchase) { //TODO: cHECK IF SUBSCRIPTION MATCHES THE SUBSCRIPTION COURSE
            attachments = await db.attachment.findMany({
                where: {
                    courseId: courseId,
                },
            });
        }

        // Fetch Mux data and the next chapter if the chapter requires subscription or the user has purchased the course
        if (chapter.subscription || purchase) {
            muxData = await db.muxData.findUnique({
                where: {
                    chapterId: chapterId,
                },
            });

            nextChapter = await db.chapter.findFirst({
                where: {
                    courseId: courseId,
                    isPublished: true,
                    position: {
                        gt: chapter.position,
                    },
                },
                orderBy: {
                    position: "asc",
                },
            });
        }

        // Fetch the user's progress for the current chapter
        const userProgress = await db.userProgress.findUnique({
            where: {
                userId_chapterId: {
                    userId,
                    chapterId,
                },
            },
        });

        // Return the gathered data
        return {
            chapter,
            course,
            muxData,
            attachments,
            nextChapter,
            userProgress,
            purchase,
        };
    } catch (error) {
        console.log("[GET_CHAPTER]", error);
        return {
            chapter: null,
            course: null,
            muxData: null,
            attachments: [],
            nextChapter: null,
            userProgress: null,
            purchase: null,
        };
    }
};
