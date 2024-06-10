"use client"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { CreateCourse } from "./create-course-title"
import { PlusCircle } from "lucide-react"

export function CreateCourseDialog() {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="default"> <PlusCircle className="h-4 w-4 mr-2" />Add Course</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <CreateCourse />
            </AlertDialogContent>
        </AlertDialog>
    )
}
