import db from "@/lib/db";
import { User, auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DataTable } from "../../../_components/data-table";
import { columns } from "../../../_components/user-columns";
import { Course, Purchase } from "@prisma/client";
import { getProgress } from "@/app/actions/get-progress";

export const maxDuration = 60;

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
    const { sessionClaims } = auth();

    // If the user does not have the admin role, redirect them to the sign-in page
    if (sessionClaims?.metadata.role !== "admin") {
        redirect("/sign-in");
    }

    try {
        const [course, usersResponse] = await Promise.all([
            db.course.findUnique({
                where: { id: params.courseId },
                include: {
                    purchases: { orderBy: { createdAt: "desc" } },
                    chapters: {
                        where: { isPublished: true },
                        include: { userProgress: true },
                        orderBy: { position: "asc" }
                    }
                }
            }),
            clerkClient.users.getUserList()
        ]);

        if (!course) {
            return (
                <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm m-4 p-10 mt-16">
                    <div className="flex flex-col items-center gap-1 text-center">
                        <h3 className="text-2xl font-bold tracking-tight">Course not found</h3>
                        <p className="text-sm text-muted-foreground">
                            The course you are looking for does not exist.
                        </p>
                    </div>
                </div>
            );
        }

        const selectedCourse = course.title;
        const users = JSON.parse(JSON.stringify(usersResponse.data));

        const data: ExtendedPurchase[] = await Promise.all(
            users.map(async (user: User) => {
                const [userPurchase, userSubscription, progressCount, isEnrolled] = await Promise.all([
                    course.purchases.find(p => p.userId === user.id) || null,
                    db.stripeCustomer.findUnique({ where: { userId: user.id } }),
                    getProgress(user.id, course.id),
                    db.enrollees.findUnique({
                        where: {
                            userId_courseId: {
                                courseId: course.id,
                                userId: user.id
                            }
                        }
                    })
                ]);

                const hasPurchase = !!userPurchase;

                const chapterProgress = course.chapters.map(chapter => {
                    const progress = chapter.userProgress.find(up => up.userId === user.id);
                    return {
                        chapterTitle: chapter.title,
                        completed: progress ? progress.isCompleted : false
                    };
                });

                const completedCourse = chapterProgress.every(ch => ch.completed);
                // Determine engagement type

                let engagementType = "";
                if (!hasPurchase && isEnrolled && (!userSubscription || userSubscription?.subscription === "null")) {
                    engagementType = "FREE User";
                } else if (hasPurchase && isEnrolled && (!userSubscription || userSubscription?.subscription === "null")) {
                    engagementType = "Purchase Only";
                } else if (!hasPurchase && isEnrolled && userSubscription?.subscription !== "null") {
                    engagementType = `${userSubscription!.subscription} User`;
                } else if (hasPurchase && isEnrolled && userSubscription?.subscription) {
                    engagementType = `${userSubscription.subscription} + Purchase User`;
                } else {
                    return null
                }

                if (progressCount === null || !isEnrolled) return null;

                return {
                    ...userPurchase,
                    course,
                    user,
                    chapterProgress,
                    completedCourse,
                    currentChapter: chapterProgress.find(ch => !ch.completed)?.chapterTitle || "Completed",
                    progressCount,
                    engagementType
                };
            })
        );

        const filteredData = data.filter((row): row is ExtendedPurchase => row !== null);

        return (
            <div className="items-center m-4 mt-16">
                <h1 className="text-lg font-semibold md:text-2xl">{selectedCourse} Users/Students</h1>
                <DataTable columns={columns} data={filteredData} />
            </div>
        );
    } catch (error) {
        console.error("Error fetching course data:", error);
        return (
            <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm m-4 p-10 mt-16">
                <div className="flex flex-col items-center gap-1 text-center">
                    <h3 className="text-2xl font-bold tracking-tight">Error fetching course data</h3>
                    <p className="text-sm text-muted-foreground">
                        There was an error while fetching course data. Please try again later.
                    </p>
                </div>
            </div>
        );
    }
};

export default CourseUsers;
