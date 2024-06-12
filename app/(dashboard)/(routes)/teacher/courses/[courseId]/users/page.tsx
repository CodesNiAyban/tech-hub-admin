import db from "@/lib/db";
import { User, auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DataTable } from "../../_components/data-table";
import { columns } from "../../_components/user-columns";
import { getProgress } from "@/app/actions/get-progress";
import { Course, Purchase } from "@prisma/client";

interface ExtendedPurchase extends Purchase {
    user: User;
    chapterProgress: { chapterTitle: string; completed: boolean }[];
    completedCourse: boolean;
    currentChapter: string;
    progressCount: number;
    engagementType: string;
    course: Course;
}

const CourseUsers = async ({ params }: { params: { courseId: string } }) => {
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
                        userProgress: true
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
        const usersResponse = await clerkClient.users.getUserList();
        const users = JSON.parse(JSON.stringify(usersResponse.data));


        const data: ExtendedPurchase[] = await Promise.all(
            users.map(async (user: User) => {
                const userPurchase = course.purchases.find(p => p.userId === user.id);
                const hasPurchase = !!userPurchase;


                const chapterProgress = course.chapters.map(chapter => {
                    const progress = chapter.userProgress.find(up => up.userId === user.id);
                    return {
                        chapterTitle: chapter.title,
                        chapter.
                        completed: progress ? progress.isCompleted : false
                    };
                });

                const completedCourse = chapterProgress.every(ch => ch.completed);
                const progressCount = await getProgress(user.id, course.id);
                const hasProgress = course.chapters.some(chapter => chapter.userProgress.length > 0);
                const userSubscription = await db.stripeCustomer.findUnique({ where: { userId: user.id } });

                // Determine engagement type
                let engagementType = "";

                if (!hasPurchase && hasProgress && userSubscription) {
                    engagementType = `${userSubscription.subscription} Subscription Only`;
                } else if (hasPurchase && (!userSubscription || userSubscription.subscription === "null")) {
                    engagementType = "Purchase Only";
                } else if (!hasPurchase && userSubscription && userSubscription.subscription !== "null") {
                    engagementType = `Subscription Only`;
                } else if (hasPurchase && userSubscription && userSubscription.subscription) {
                    engagementType = `${userSubscription.subscription} + Purchase`;
                }

                if (!engagementType) return null

                return {
                    ...userPurchase,
                    course,
                    user,
                    chapterProgress,
                    completedCourse,
                    chapters: course.chapters.map(chapter => ({
                        ...chapter,
                        userProgressCount: chapter.userProgress.length,
                    })),
                    currentChapter: chapterProgress.find(ch => !ch.completed)?.chapterTitle || "Completed",
                    progressCount,
                    engagementType
                };
            })
        );

        const filteredData = data.filter((row): row is ExtendedPurchase => row !== null);

        return (
            <div className="items-center m-4 mt-16">
                <h1 className="text-lg font-semibold md:text-2xl">{selectedCourse} Users</h1>
                <DataTable columns={columns} data={filteredData} />
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