import { getCourses } from "@/app/actions/get-courses";
import { CoursesList } from "@/components/courses-list";
import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Categories } from "./_components/categories";
import { checkRole } from "@/lib/role";
import { redirect } from "next/navigation";
import toast from "react-hot-toast";

interface BrowseProps {
    searchParams: {
        title: string;
        categoryId: string;
    }
}

const Browse = async ({
    searchParams,
}: BrowseProps) => {
    const { userId } = auth();

    if (!userId) {
        return redirect("/sign-in")
    }

    const categories = await db.category.findMany({
        orderBy: {
            name: "asc"
        }
    });

    const courses = await getCourses({
        userId: userId || "",
        ...searchParams,
    })

    return (
        <>
            <div className="mt-10 flex-1 flex flex-col p-3">
                <Categories
                    items={categories}
                />
                <CoursesList
                    items={courses}
                />
            </div>
        </>
    );
}

export default Browse;