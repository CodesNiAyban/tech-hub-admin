import { Button } from "@/components/ui/button";
import db from "@/lib/db";
import { auth, clerkClient } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

import { DataTable } from "../../_components/data-table";
import { columns } from "../../_components/user-columns";

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
        const purchase = await db.purchase.findMany({
            where: {
                courseId: params.courseId,
            },
            orderBy: {
                createdAt: "asc",
            }
        });

        const course = await db.course.findUnique({
            where: {
                id: params.courseId
            },
            include: {
                purchases: {
                    orderBy: {
                        createdAt: "desc",
                    },
                },
            },
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

        let users = [];
        try {
            const userResponse = await clerkClient.users.getUserList();
            users = JSON.parse(JSON.stringify(userResponse.data));
        } catch (error) {
            console.error("Error parsing user data:", error);
        }
    
        const data = course.purchases.map(purchase => {
            const user = users.find((user: { id: string }) => user.id === purchase.userId);
            return {
                ...course,
                user: user,
            };
        });

        // const data = course.purchases.map(purchase => {
        //     const user = users.find(user => user.id === purchase.userId) || { id: purchase.userId, username: "Unknown" };
        //     return {
        //         ...course,
        //         ...purchase,
        //         user,
        //     };
        // });

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
