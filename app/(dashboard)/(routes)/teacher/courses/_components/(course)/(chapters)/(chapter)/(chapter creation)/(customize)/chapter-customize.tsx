"use client"

import { IconBadge } from "@/components/icon-badge"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { LayoutDashboard } from "lucide-react"
import { useState } from "react"
import { ChapterTitle } from "./(title)/chapter-title"
import { ChapterDescription } from "./(description)/chapter-description"
import { Chapter } from "@prisma/client"

interface TitleFormProps {
    initialData: Chapter
    courseId: string;
    chapterId: string;
}

export const CustomizeChapter = ({
    initialData,
    courseId,
    chapterId
}: TitleFormProps) => {
    const [modalOpen, setModalOpen] = useState(false);
    const toggleModal = () => setModalOpen((current) => !current);

    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle>
                    <div className="flex items-center center gap-x-2">
                        <IconBadge icon={LayoutDashboard} size={"default"} variant={"default"} />
                        Customize your Chapter
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ChapterTitle
                    initialData={initialData}
                    courseId={courseId}
                    toggleModal={toggleModal}
                    chapterId={chapterId}
                />
                <ChapterDescription
                    initialData={initialData}
                    courseId={courseId}
                    toggleModal={toggleModal}
                    chapterId={chapterId}
                />
            </CardContent>
        </Card>
    );
}