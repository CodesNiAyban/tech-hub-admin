import { getCourses } from "@/actions/get-courses";
import { CoursesList } from "@/components/courses-list";
import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Categories } from "./_components/categories";

export const maxDuration = 60;

interface BrowseProps {
    searchParams: {
        title: string;
        categoryId: string;
    };
}

const Browse = async ({ searchParams }: BrowseProps) => {
    let { userId } = auth();

    if (!userId) {
        userId = "";
    }

    const categories = await db.category.findMany({
        orderBy: {
            name: "asc",
        },
    });

    const courses = await getCourses({
        userId: userId || "",
        ...searchParams,
    });

    const user = await db.stripeCustomer.findUnique({
        where: {
            userId: userId || "",
        },
    });

    return (
        <>
            <div className="mt-10 flex-1 flex flex-col p-3">
                <Categories items={categories} />
                <CoursesList items={courses} />
            </div>
        </>
    );
};

export default Browse;
