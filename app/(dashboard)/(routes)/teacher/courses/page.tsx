import db from "@/lib/db";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CreateCourseDialog } from "../_components/create-course";
import { columns } from "./_components/course-columns";
import { DataTable } from "./_components/data-table";

export const maxDuration = 60;

const Courses = async () => {
  const { sessionClaims } = auth();

  // If the user does not have the admin role, redirect them to the home page
  if (sessionClaims?.metadata.role !== "admin") {
    redirect("/sign-in");
  }

  const [courses, userResponse] = await Promise.all([
    db.course.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        chapters: {
          orderBy: {
            position: "asc",
          },
          include: {
            userProgress: true,
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
        },
      },
    }),
    clerkClient.users.getUserList()
  ]);

  const users = JSON.parse(JSON.stringify(userResponse.data));

  const data = await Promise.all(courses.map(async (course) => {
    const courseCreator = users.find((user: { id: string }) => user.id === course.userId);
    const userCount= await db.enrollees.count({
      where: {
        courseId: course.id,
      },
    });

    return {
      ...course,
      courseCreator,
      userCount,
    };
  }));

  return (
    <>
      {courses.length > 0 ? (
        <div className="p-6 mt-10">
          <DataTable columns={columns} data={data} />
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm m-4 p-10 mt-16">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">You have no courses</h3>
            <p className="text-sm text-muted-foreground">
              You can start selling as soon as you add a course.
            </p>
            <CreateCourseDialog />
          </div>
        </div>
      )}
    </>
  );
};

export default Courses;
