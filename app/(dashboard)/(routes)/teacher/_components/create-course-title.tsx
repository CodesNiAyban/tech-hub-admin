import { createSchema } from "@/app/(dashboard)/(routes)/teacher/courses/_components/_utils/form-validation"
import { AlertDialogCancel } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import * as z from "zod"

export const CreateCourse = () => {
    const router = useRouter();
    const createForm = useForm<z.infer<typeof createSchema>>({
        resolver: zodResolver(createSchema),
        defaultValues: {
            title: "",
        }
    });

    const onSubmit = async (values: z.infer<typeof createSchema>) => {
        try {
            const response = axios.post("/api/courses", values);
            router.push(`/teacher/courses/${(await response).data.id}`)
            toast.promise(response, {
                loading: "Processing",
                error: "An error occured, please try again later.",
                success: "Course Title Created!",
            });
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    if (error.response.status === 403) {
                        toast.error("Duplicate title, please try another title.");
                    } else {
                        toast.error(error.response.data.message || "An error occurred");
                    }
                } else {
                    toast.error("An unexpected error occurred");
                }
            } else {
                toast.error("An unknown error occurred");
            }
        }
    }

    const { isSubmitting } = createForm.formState;

    return (
        <>
            <CardHeader>
                <CardTitle>Name your New Course</CardTitle>
                <CardDescription>
                    What would you like to name your course? Don&apos;t worry you can change this later.
                </CardDescription>
            </CardHeader>
            <Form {...createForm}>
                <form onSubmit={createForm.handleSubmit(onSubmit)} >
                    <CardContent>
                        <FormField
                            control={createForm.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Course Title
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="e.g Advanced Web Development"
                                            {...field}
                                            data-testid="course-title"
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        What will you teach in this course?
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter className="flex justify-between mt-3">
                        <AlertDialogCancel asChild>
                            <Button variant="outline" >
                                Cancel
                            </Button>
                        </AlertDialogCancel>
                        <Button type="submit" disabled={isSubmitting}>
                            Continue
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </>
    );
}