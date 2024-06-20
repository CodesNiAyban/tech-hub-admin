import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CustomizeChapter } from "../../../_components/(course)/(chapters)/(chapter)/(chapter creation)/(customize)/chapter-customize";
import { AccessSettings } from "../../../_components/(course)/(chapters)/(chapter)/(chapter creation)/(access)/access-settings";
import { AddVideo } from "../../../_components/(course)/(chapters)/(chapter)/(chapter creation)/(video)/add-video";
import { Banner } from "@/components/banner";
import { ChapterActions } from "../../../_components/chapter-actions";

const ChapterIdPage = async ({
    params
}: {
    params: {
        courseId: string;
        chapterId: string;
    }
}) => {
    const { sessionClaims } = auth();

    // If the user does not have the admin role, redirect them to the home page
    if (sessionClaims?.metadata.role !== "admin") {
        redirect("/sign-in");
    }

    const chapter = await db.chapter.findUnique({
        where: {
            id: params.chapterId,
            courseId: params.courseId
        },
        include: {
            muxData: true,
        },
    });

    if (!chapter) {
        return redirect("/")
    }

    // TODO: Add quiz
    const requiredFields = [
        chapter.title,
        chapter.description,
        chapter.videoUrl,
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;

    const completionText = `(${completedFields}/${totalFields})`

    const isComplete = requiredFields.every(Boolean);

    return (
        <div className="mt-16 sm:mt-16 md:mt-[56px] lg:mt-[60px]">
            {!chapter.isPublished && (
                <Banner
                    variant="warning"
                    label="This chapter is not published and will not be visible in the course"
                />
            )}
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div className="w-full">
                        <Link
                            href={`/teacher/courses/${params.courseId}`}
                            className="flex items-center text-sm hover:opacity-75 transition mb-6"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to course setup
                        </Link>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-2">
                        <h1 className="text-2xl font-medium">
                            Course Chapter Creation
                        </h1>
                        <span className="text-sm root:text-slate-700">
                            Complete all fields {completionText}
                        </span>
                    </div>
                    <ChapterActions
                        isComplete={isComplete}
                        courseId={params.courseId}
                        chapterId={params.chapterId}
                        isPublished={chapter.isPublished}
                    />
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
                    <div>
                        <div className="flexcenter gap-x-2">
                            <CustomizeChapter
                                initialData={chapter}
                                courseId={params.courseId}
                                chapterId={params.chapterId}
                            />
                            <AccessSettings
                                initialData={chapter}
                                courseId={params.courseId}
                                chapterId={params.chapterId}
                            />
                        </div>
                    </div>
                    <div>
                        <div className="flexcenter gap-x-2">
                            <AddVideo
                                initialData={chapter}
                                courseId={params.courseId}
                                chapterId={params.chapterId}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChapterIdPage;