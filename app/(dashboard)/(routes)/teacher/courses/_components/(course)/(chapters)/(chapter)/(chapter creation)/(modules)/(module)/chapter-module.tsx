"use client"
import { Chapter } from "@prisma/client";
import { useEffect, useState } from "react";
import { EditModuleDialog } from "./edit-module-dialog";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Loader2 } from "lucide-react";
import { DeleteModuleDialog } from "./delete-module-dialog";

interface ChapterModuleProps {
    initialData: Chapter;
    chapterId: string;
    courseId: string;
    toggleModal: () => void
}

export const EditChapterModule = ({
    toggleModal,
    initialData,
    chapterId,
    courseId
}: ChapterModuleProps) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);


    return isClient ? (
        <div className="grid gap-6">
            <div className="grid gap-3">
                <div className="font-medium flex items-center">
                    {initialData.pdfUrl ? (
                        <>Chapter Module</>
                    ) : (
                        <>Chapter Module <span className="text-destructive text-xs flex ml-1">(Optional)</span></>
                    )}
                    <EditModuleDialog
                        title={"Add a pdf file"}
                        formLabel={"New Chapter Module"}
                        description={"Add a new pdf file for this Chapter. Click 'Save' when you're finished."}
                        initialData={initialData}
                        courseId={courseId}
                        chapterId={chapterId}
                        toggleModal={toggleModal}
                    />
                </div>
                {!initialData.pdfUrl && (
                    <div className="border bg-muted/40 rounded-md p-4 text-center">
                        <p className="font-medium text-sm text-muted-foreground italic mb-3">No Module Added</p>
                        <p className="text-sm text-muted-foreground">Add a PDF file to enhance this chapter.</p>
                    </div>
                )}
                {initialData.pdfUrl && (
                    <>
                        <DeleteModuleDialog
                            courseId={courseId}
                            chapterId={chapterId}
                        />
                        <iframe
                            src={initialData.pdfUrl}
                            width="100%"
                            height="500px"
                            className="border rounded-md"
                        />
                    </>

                )}
            </div>
        </div>
    ) : (
        <Loader2 className="animate-spin h-8 w-8" />
    );
}
