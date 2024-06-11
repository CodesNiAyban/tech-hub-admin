import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server"

export async function POST(
    req: Request,
) {
    try {
        const { userId } = auth();
        const { title } = await req.json();

        if (!userId) {
            return new NextResponse("Unathorized", { status: 401 })
        }

        const existingCourse = await db.course.findUnique({ where: { title } });

        if (existingCourse) {
            return NextResponse.json({ error: "Title must be unique" }, { status: 403 })
        }

        const baseCode = title
            .replace(/\s+/g, '')  // Remove spaces
            .substring(0, 3)      // Take the first 3 characters
            .toUpperCase();       // Convert to uppercase

        let code = baseCode;
        let counter = 0;

        // Check for uniqueness and increment the counter if necessary
        while (await db.course.findUnique({ where: { code } })) {
            counter++;
            code = `${baseCode}${counter}`;
        }

        const course = await db.course.create({
            data: {
                userId,
                title,
                code
            }
        });

        return NextResponse.json(course)
    } catch (error) {
        console.log("[COURSES]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}