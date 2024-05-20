"use client"

import { IconBadge } from "@/components/icon-badge"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Eye, LayoutDashboard } from "lucide-react"
import { useState } from "react"
import { ChapterAccess } from "./chapter-access"
import { Chapter } from "@prisma/client"

interface AccessFormProps {
    initialData: Chapter
    courseId: string;
    chapterId: string;
}

export const AccessSettings = ({
    initialData,
    courseId,
    chapterId
}: AccessFormProps) => {
    const [modalOpen, setModalOpen] = useState(false);
    const toggleModal = () => setModalOpen((current) => !current);

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <div className="flex items-center center gap-x-2">
                        <IconBadge icon={Eye} size={"default"} variant={"default"} />
                        Access Settings
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ChapterAccess
                    initialData={initialData}
                    courseId={courseId}
                    toggleModal={toggleModal}
                    chapterId={chapterId}
                />
            </CardContent>
        </Card>
    );
}