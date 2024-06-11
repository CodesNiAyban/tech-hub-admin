import db from "@/lib/db";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DataTable } from "../../_components/data-table";
import { columns } from "../../_components/user-columns";
import { getProgress } from "@/app/actions/get-progress";

const CourseUsers = async ({
    params
}: {
    params: { courseId: string }
}) => {
    const { userId } = auth();

    if (!userId) {
        return redirect("/");
    } // TODO: Change to admin check

    try {
        const course = await db.course.findUnique({
            where: { id: params.courseId },
            include: {
                purchases: {
                    orderBy: { createdAt: "desc" }
                },
                chapters: {
                    where: { isPublished: true },
                    include: {
                        userProgress: {
                            where: { userId },
                        }
                    },
                    orderBy: { position: "asc" }
                }
            }
        });

        if (!course) {
            return (
                <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm m-4 p-10 mt-16">
                    <div className="flex flex-col items-center gap-1 text-center">
                        <h3 className="text-2xl font-bold tracking-tight">
                            Course not found
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            The course you are looking for does not exist.
                        </p>
                    </div>
                </div>
            );
        }

        const selectedCourse = course.title;
        const users = await clerkClient.users.getUserList();
        const parsedUsers = JSON.parse(JSON.stringify(users.data));

        const data = await Promise.all(course.purchases.map(async purchase => {
            const user = parsedUsers.find((user: { id: string }) => user.id === purchase.userId);
            const chapterProgress = course.chapters.map(chapter => {
                const progress = chapter.userProgress[0];
                return {
                    chapterTitle: chapter.title,
                    completed: progress ? progress.isCompleted : false
                };
            });
            const completedCourse = chapterProgress.every(ch => ch.completed);
            const progressCount = await getProgress(purchase.userId, course.id); // Get progress count for each user
            return {
                ...purchase,
                user,
                chapterProgress,
                completedCourse,
                currentChapter: chapterProgress.find(ch => !ch.completed)?.chapterTitle || "Completed",
                progressCount // Add progressCount to the data
            };
        }));

        return (
            <div className="items-center m-4 mt-16">
                <h1 className="text-lg font-semibold md:text-2xl">{selectedCourse} Users</h1>
                <DataTable columns={columns} data={data} />
            </div>
        );
    } catch (error) {
        console.error("Error fetching course data:", error);
        return (
            <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm m-4 p-10 mt-16">
                <div className="flex flex-col items-center gap-1 text-center">
                    <h3 className="text-2xl font-bold tracking-tight">
                        Error fetching course data
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        There was an error while fetching course data. Please try again later.
                    </p>
                </div>
            </div>
        );
    }
};

export default CourseUsers;