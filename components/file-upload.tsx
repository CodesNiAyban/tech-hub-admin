"use client"

import { UploadDropzone } from "@/lib/uploadthing";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import toast from "react-hot-toast";

interface FileUploadProps {
    onChange: (url?: string) => void;
    endpoint: keyof typeof ourFileRouter;
}

export const FileUpload = ({
    onChange,
    endpoint
}: FileUploadProps) => {
    return (
        <UploadDropzone
            endpoint={endpoint}
            onClientUploadComplete={(res) => {
                onChange(res?.[0].url);
            }}
            onUploadError={(error: Error) => {
                toast.error(`${error?.message}`)
            }}
            className="ut-label:text-lg ut-label:text-zinc-400 ut-button:bg-primary dark:ut-label:text-zinc-400 dark:ut-button:bg-primary dark:ut-button:text-primary-foreground ut-allowed-content:ut-uploading:text-red-300"
        />
    )
}