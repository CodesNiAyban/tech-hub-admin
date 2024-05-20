import { createSchema } from "@/app/(dashboard)/(routes)/teacher/courses/_components/_utils/form-validation"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useForm } from "react-hook-form"
import * as z from "zod"
import axios from "axios"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

export const CreateCourse = () => {
    const router = useRouter();
    const createForm = useForm<z.infer<typeof createSchema>>({
        resolver: zodResolver(createSchema),
        defaultValues: {
            title: "",
        }
    });

    const createTitle = async (values: z.infer<typeof createSchema>) => {
        const response = await axios.post("/api/courses", values);
        router.push(`/teacher/courses/${response.data.id}`)
        return response;
    };

    const onSubmit = async (values: z.infer<typeof createSchema>) => {
        try {
            const response = createTitle(values);
            toast.promise(response, {
                loading: "Processing",
                error: "An error occured, please try again later.",
                success: "Course Title Created!",
            });
        } catch (error) {
            if (typeof error === 'string') {
                toast.error(error);
            } else {
                toast.error("An error occurred. Please try again later.");
            }
        }
    }

    const { isSubmitting } = createForm.formState;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Name your New Course</CardTitle>
                <CardDescription>
                    What would you like to name your course? Don&apos;t worry you can change this later.
                </CardDescription>
            </CardHeader>
            <Form {...createForm}>
                <form onSubmit={createForm.handleSubmit(onSubmit)} >
                    <CardContent>
                        <div className="grid gap-6">
                            <div className="grid gap-3">
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
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                What will you teach in this course?
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="outline" asChild>
                            <Link href="/teacher/courses">
                                Cancel
                            </Link>
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            Continue
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
}