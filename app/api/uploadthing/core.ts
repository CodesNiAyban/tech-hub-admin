import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth as clerkAuth } from "@clerk/nextjs/server"; // Renamed the imported auth

const f = createUploadthing();

const handleAuth = () => {
    const { userId } = clerkAuth(); // Use clerkAuth instead of auth
    if (!userId) throw new Error("Unathorized");
    return { userId };
}

const auth = (req: Request) => ({ id: "fakeId" }); // Fake auth function

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    courseImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
        .middleware(() => handleAuth())
        .onUploadComplete(() => { }),
    courseAttachments: f(["text", "image", "video", "audio", "pdf"])
        .middleware(() => handleAuth())
        .onUploadComplete(() => { }),
    chapterVideo: f({ video: { maxFileCount: 1, maxFileSize: "512GB" } })
        .middleware(() => handleAuth())
        .onUploadComplete(() => { }),
} as FileRouter; // Changed satisfies to as and fixed FileRouter type

export type OurFileRouter = typeof ourFileRouter;
