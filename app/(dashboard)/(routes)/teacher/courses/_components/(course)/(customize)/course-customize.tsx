"use client"

import { IconBadge } from "@/components/icon-badge"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Category, Course } from "@prisma/client"
import { LayoutDashboard } from "lucide-react"
import { useState } from "react"
import { CourseDescription } from "./(description)/course-description"
import { CourseImage } from "./(image)/course-image"
import { CourseTitle } from "./(title)/course-title"
import { CourseCategories } from "./(categories)/course-categories"

interface TitleFormProps {
    initialData: Course & { categories: Category[] };
    courseId: string;
    categories: {
        id: string;
        name: string;
    }[]
}

export const CustomizeCourse = ({
    initialData,
    courseId,
    categories
}: TitleFormProps) => {
    const [modalOpen, setModalOpen] = useState(false);
    const toggleModal = () => setModalOpen((current) => !current);

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <div className="flex items-center center gap-x-2">
                        <IconBadge icon={LayoutDashboard} size={"default"} variant={"default"} />
                        Customize your Course
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <CourseTitle
                    initialData={initialData}
                    courseId={courseId}
                    toggleModal={toggleModal}
                />
                <CourseDescription
                    initialData={initialData}
                    courseId={courseId}
                    toggleModal={toggleModal}
                />
                <CourseImage
                    initialData={initialData}
                    courseId={courseId}
                    toggleModal={toggleModal}
                />
                <CourseCategories
                    initialData={initialData}
                    courseId={courseId}
                    toggleModal={toggleModal}
                    categories={categories}
                />
            </CardContent>
        </Card>
    );
}