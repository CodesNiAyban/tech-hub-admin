import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/course-columns";


const Courses = async () => {
    const { userId } = auth();

    if (!userId) {
        return redirect("/");
    }
    

    const courses = await db.course.findMany({
        orderBy: {
            createdAt: "desc",
        },
        include: {
            chapters: {
                orderBy: {
                    position: "asc",
                },
            },
            categories: {
                orderBy: {
                    name: "desc",
                },
            },
            attachments: {
                orderBy: {
                    createdAt: "desc",
                },
            },
            purchases: {
                orderBy: {
                    createdAt: "desc",
                },
            }
        },
    });

    let users = [];
    try {
        const userResponse = await clerkClient.users.getUserList();
        users = JSON.parse(JSON.stringify(userResponse.data));
    } catch (error) {
        console.error("Error parsing user data:", error);
    }

    const data = courses.map(course => {
        const user = users.find((user: { id: string }) => user.id === course.userId);
        return {
            ...course,
            user: user || { id: course.userId, username: "Unknown" },
        };
    });

    return (
        <>
            {courses.length > 0 ? (
                <div className="items-center m-4 mt-16">
                    <h1 className="text-lg font-semibold md:text-2xl">Courses</h1>
                    <DataTable columns={columns} data={data} />
                </div>
            ) : (
                <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm m-4 p-10 mt-16">
                    <div className="flex flex-col items-center gap-1 text-center">
                        <h3 className="text-2xl font-bold tracking-tight">
                            You have no courses
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            You can start selling as soon as you add a course.
                        </p>
                        <Button size="sm" className="mt-4" asChild>
                            <Link href="/teacher/create">
                                Add Course
                            </Link>
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Courses;
