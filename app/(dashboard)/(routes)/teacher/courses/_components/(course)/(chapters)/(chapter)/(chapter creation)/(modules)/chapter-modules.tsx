"use client"

import { IconBadge } from "@/components/icon-badge"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Chapter } from "@prisma/client"
import { File } from "lucide-react"
import { useState } from "react"
import { EditChapterModule } from "./(module)/chapter-module"
interface TitleFormProps {
    initialData: Chapter;
    courseId: string;
    chapterId: string ;
}

export const ChapterModule = ({
    initialData,
    courseId,
    chapterId,
}: TitleFormProps) => {
    const [modalOpen, setModalOpen] = useState(false);
    const toggleModal = () => setModalOpen((current) => !current);

    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle>
                    <div className="flex items-center center gap-x-2">
                        <IconBadge icon={File} size={"default"} variant={"default"} />
                        Resources and Modules
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <EditChapterModule
                    initialData={initialData}
                    courseId={courseId}
                    chapterId={chapterId}
                    toggleModal={toggleModal}
                />
            </CardContent>
        </Card>
    );
}