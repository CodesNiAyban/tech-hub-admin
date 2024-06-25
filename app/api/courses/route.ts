import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server"

export async function POST(
    req: Request,
) {
    try {
        const { sessionClaims, userId } = auth();
        const { title } = await req.json();

        if (sessionClaims?.metadata.role !== "admin") {
            return new NextResponse("Unathorized", { status: 401 })
        }

        if (!userId) {
            return new NextResponse("Unathorized", { status: 401 })
        }

        const existingCourse = await db.course.findUnique({ where: { title } });

        if (existingCourse) {
            return NextResponse.json({ error: "Title must be unique" }, { status: 403 })
        }
        // Check for uniqueness and increment the counter if necessary

        const course = await db.course.create({
            data: {
                userId,
                title,
            }
        });

        return NextResponse.json(course)
    } catch (error) {
        console.log("[COURSES]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}