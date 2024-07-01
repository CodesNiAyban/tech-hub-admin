import { quizCreationSchema } from "@/app/(dashboard)/(routes)/teacher/courses/_components/_utils/form-validation";
import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string; chapterId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const courseOwner = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId,
            },
        });

        if (!courseOwner) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const chapter = await db.chapter.findUnique({
            where: {
                id: params.chapterId,
                courseId: params.courseId,
            },
        });

        if (!chapter) {
            return new NextResponse("Chapter Not Found", { status: 404 });
        }

        const body = await req.json();
        const { topic, type, amount, level } = quizCreationSchema.parse(body);

        if (!topic || !type || !level || !amount) {
            return new NextResponse("Invalid data", { status: 400 });
        }

        const enableQuiz = await db.chapter.update({
            where: {
                id: params.chapterId,
            },
            data: {
                quiz: true
            },
        })

        if (!enableQuiz) {
            return new NextResponse("Chapter Not Updated", { status: 404 });
        }

        const existingQuizSetting = await db.quizSetting.findFirst({
            where: {
                chapterId: params.chapterId,
            },
        });

        let updatedQuizSetting;

        if (existingQuizSetting) {
            updatedQuizSetting = await db.quizSetting.update({
                where: {
                    id: existingQuizSetting.id,
                },
                data: {
                    topic,
                    gameType: type,
                    amount,
                    level,
                    chapterId: params.chapterId,

                },
            });
        } else {
            updatedQuizSetting = await db.quizSetting.create({
                data: {
                    topic,
                    gameType: type,
                    amount,
                    level,
                    chapterId: params.chapterId,
                },
            });
        }

        return NextResponse.json(updatedQuizSetting);
    } catch (error) {
        console.log("[QUIZ]", error)
        if (error instanceof ZodError) {
            return NextResponse.json(
                { error: error.issues },
                {
                    status: 400,
                }
            );
        } else {
            return new NextResponse("[QUIZ]", { status: 500 });
        }
    }
}
