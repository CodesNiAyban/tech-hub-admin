import { Category, Course } from "@prisma/client";
import React from "react";
import { CourseCard } from "./course-card";

type CourseWithProgressWithCategory = Course & {
    categories: Category[] | null;
    chapters: { id: string }[];
    progress?: number | null;
}

interface CoursesListProps {
    items: CourseWithProgressWithCategory[];
}

export const CoursesList = ({
    items,
}: CoursesListProps) => {
    return (
        <div className="flex-1 flex flex-col p-3">
            {items.length > 0 ? (
                <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
                    {items.map((item) => (
                        <CourseCard
                            key={item.id}
                            id={item.id}
                            title={item.title}
                            imageUrl={item.imageUrl!}
                            chaptersLength={item.chapters.length}
                            price={item.price!}
                            progress={item.progress!}
                            categories={item.categories!}
                        />
                    ))}
                </div>
            ) : (
                <div
                    className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed shadow-sm mb-20" // Added margin-bottom to move the box higher
                    x-chunk="dashboard-02-chunk-1"
                >
                    <div className="flex flex-col items-center gap-1 text-center">
                        <h3 className="text-2xl font-bold tracking-tight">
                            No Courses Found
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Please try to search another keyword or click a category.
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}
