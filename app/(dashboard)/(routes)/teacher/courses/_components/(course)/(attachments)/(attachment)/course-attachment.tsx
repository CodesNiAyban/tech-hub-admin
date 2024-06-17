
import { EditAttachmentDialog } from "./edit-attachment-dialog";
import { Attachment, Course } from "@prisma/client";
import { File, ImageIcon, Loader2, X } from "lucide-react";
import { useState } from "react";
import { DeleteAttachmentDialog } from "./delete-attachment-dialog";

interface CourseAttachmentProps {
    initialData: Course & { attachments: Attachment[] };
    courseId: string;
    toggleModal: () => void
}

export const EditCourseAttachment = ({
    toggleModal,
    initialData,
    courseId,
}: CourseAttachmentProps) => {
    const [deletingId, setDeletingId] = useState<string | null>(null)

    return (
        <div className="grid gap-6">
            <div className="grid gap-3">
                <div className="font-medium flex items-center">
                    {initialData.attachments.length > 0 ? (<>Course Attachments</>) :
                        (<>Course Attachments <a className="text-destructive text-xs flex ml-1">(Optional)</a></>)
                    }
                    <EditAttachmentDialog
                        title={"Add an Attachment"}
                        formLabel={"New Course Attachment"}
                        description={"Add a new attachment for this course. Click 'Save' when you're finished."}
                        initialData={initialData}
                        courseId={courseId}
                        toggleModal={toggleModal}
                    />
                </div>
                {initialData.attachments.length === 0 && (
                    <div className="border bg-muted/40 rounded-md p-2 px-3">
                        <p className="font-medium text-sm text-muted-foreground italic">Add attachments</p>
                    </div>
                )}
                {initialData.attachments.length >= 0 && (
                    <div className="space-y-2">
                        {initialData.attachments.map((attachment) => (
                            <div
                                key={attachment.id}
                                className="flex items-center w-full bg-muted/40 rounded-md p-2 px-3 border"
                            >
                                <File className="h-4 w-4 mr-2 flex-shrink-0" />
                                <p className="text-xs line-clamp-1">
                                    {attachment.name}
                                </p>
                                {deletingId === attachment.id ? (
                                    <div>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    </div>
                                ) : (
                                    <DeleteAttachmentDialog
                                        attachmentId={attachment.id}
                                        courseId={courseId}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div >
    );
}