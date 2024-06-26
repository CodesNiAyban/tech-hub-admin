import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PUT(
    req: Request,
    { params }: { params: { courseId: string; } }
) {
    try {
        const { sessionClaims } = auth();

        if (sessionClaims?.metadata.role !== "admin") {
            return new NextResponse("Unathorized", { status: 401 })
        }

        const { list } = await req.json();

        for (let item of list) {
            await db.chapter.update({
                where: { id:item.id },
                data: { position: item.position }
            });
        }

        return new NextResponse("Success", { status: 200 });
    } catch (error) {
        console.log("[REORDER]", error)
        return new NextResponse("Internal Error", { status: 500 });
    }
}