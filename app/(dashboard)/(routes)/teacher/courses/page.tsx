import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/course-columns";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateCourseDialog } from "../_components/create-course";

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
        include: {
          userProgress: true, // Include userProgress for each chapter
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
  });

  let users = [];
  try {
    const userResponse = await clerkClient.users.getUserList();
    users = JSON.parse(JSON.stringify(userResponse.data));
  } catch (error) {
    console.error("Error parsing user data:", error);
  }

  const data = courses.map((course) => {
    const user = users.find((user: { id: string }) => user.id === course.userId);
    return {
      ...course,
      user: user || { id: course.userId, username: "Unknown" },
      chapters: course.chapters.map((chapter) => ({
        ...chapter,
        userProgressCount: chapter.userProgress.length,
      })),
    };
  });

  return (
    <>
      {courses.length > 0 ? (
        <div className="p-6 mt-10">
          <Breadcrumb className="pb-3 mt-3">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/teacher/courses">Courses</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1">
                  <BreadcrumbEllipsis className="h-4 w-4" />
                  <span className="sr-only">Toggle menu</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem>Design Ugh</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbList>
          </Breadcrumb>
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
