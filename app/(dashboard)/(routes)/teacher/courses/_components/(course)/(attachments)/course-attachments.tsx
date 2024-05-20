"use client"

import { IconBadge } from "@/components/icon-badge"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Attachment, Course } from "@prisma/client"
import { File } from "lucide-react"
import { useState } from "react"
import { EditCourseAttachment } from "./(attachment)/course-attachment"

interface TitleFormProps {
    initialData: Course & { attachments: Attachment[] };
    courseId: string;
}

export const CourseAttachment = ({
    initialData,
    courseId,
}: TitleFormProps) => {
    const [modalOpen, setModalOpen] = useState(false);
    const toggleModal = () => setModalOpen((current) => !current);

    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle>
                    <div className="flex items-center center gap-x-2">
                        <IconBadge icon={File} size={"default"} variant={"default"} />
                        Resources and Attachments
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <EditCourseAttachment
                    initialData={initialData}
                    courseId={courseId}
                    toggleModal={toggleModal}
                />
            </CardContent>
        </Card>
    );
}