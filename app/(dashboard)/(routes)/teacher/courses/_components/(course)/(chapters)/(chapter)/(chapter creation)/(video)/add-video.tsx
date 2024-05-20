"use client"

import { IconBadge } from "@/components/icon-badge"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Chapter, MuxData } from "@prisma/client"
import { Video } from "lucide-react"
import { useState } from "react"
import { ChapterVideo } from "./chapter-video"

interface ChapterVideoFormProps {
    initialData: Chapter & { muxData?: MuxData | null }
    courseId: string;
    chapterId: string;
}

export const AddVideo = ({
    initialData,
    courseId,
    chapterId
}: ChapterVideoFormProps) => {
    const [modalOpen, setModalOpen] = useState(false);
    const toggleModal = () => setModalOpen((current) => !current);

    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle>
                    <div className="flex items-center center gap-x-2">
                        <IconBadge icon={Video} size={"default"} variant={"default"} />
                        Add a Video
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ChapterVideo
                    initialData={initialData}
                    courseId={courseId}
                    toggleModal={toggleModal}
                    chapterId={chapterId}
                />
            </CardContent>
        </Card>
    );
}