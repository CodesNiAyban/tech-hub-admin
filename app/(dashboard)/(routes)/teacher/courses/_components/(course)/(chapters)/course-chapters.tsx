"use client"

import { IconBadge } from "@/components/icon-badge"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Category, Chapter, Course } from "@prisma/client"
import { ListChecks } from "lucide-react"
import { useState } from "react"
import { CourseChapter } from "./(chapter)/course-chapter"

interface ChapterFormProps {
    initialData: Course & { chapters: Chapter[] };
    courseId: string;
}

export const CourseChapters = ({
    initialData,
    courseId,
}: ChapterFormProps) => {
    const [modalOpen, setModalOpen] = useState(false);
    const toggleModal = () => setModalOpen((current) => !current);

    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle>
                    <div className="flex items-center center gap-x-2">
                        <IconBadge icon={ListChecks} size={"default"} variant={"default"} />
                        Course Chapters
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <CourseChapter
                    initialData={initialData}
                    courseId={courseId}
                    toggleModal={toggleModal}
                />
            </CardContent>
            <CardFooter className="justify-center border-t p-4">
                <p className="text-xs text-muted-foreground">
                    Drag and drop to reorder the chapters
                </p>
            </CardFooter>
        </Card>
    );
}