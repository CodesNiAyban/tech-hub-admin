import { Chapter, MuxData } from "@prisma/client";
import { Video } from "lucide-react";
import Image from "next/image";
import { EditVideoDialog } from "./set-video-dialog";
import MuxPlayer from "@mux/mux-player-react"
import { DeleteVideoDialog } from "./delete-video-dialog";

interface ChapterVideoProps {
    initialData: Chapter & { muxData?: MuxData | null }
    courseId: string;
    toggleModal: () => void
    chapterId: string
}

export const ChapterVideo = ({
    toggleModal,
    initialData,
    courseId,
    chapterId,
}: ChapterVideoProps) => {
    return (
        <div className="grid gap-6 pt-6">
            <div className="grid gap-3">
                <div className="font-medium flex items-center">
                    {initialData.videoUrl ? (<>Chapter Video</>) :
                        (<>Chapter Video <a className="text-destructive flex ml-1">*</a></>)
                    }
                    <EditVideoDialog
                        title={initialData.videoUrl ? "Replace Video" : "Add Video"}
                        formLabel={"Video"}
                        description={"Set the video for this chapter. Click 'Save' when you're finished."}
                        initialData={initialData}
                        courseId={courseId}
                        toggleModal={toggleModal}
                        chapterId={chapterId}
                    />
                </div>
                {!initialData.videoUrl ? (
                    <div className="flex items-center justify-center border h-80 bg-muted/40 rounded-md p-2 px-3">
                        <Video className="h-10 w-10 text-muted-foreground" />
                    </div>
                ) : (
                    <>
                        <DeleteVideoDialog courseId={courseId} chapterId={chapterId} />
                        <div className="relative aspect-video mt-2">
                            <MuxPlayer
                                playbackId={initialData?.muxData?.playbackId || ""}
                            />
                        </div>
                    </>
                )}
            </div>
        </div >
    );
}