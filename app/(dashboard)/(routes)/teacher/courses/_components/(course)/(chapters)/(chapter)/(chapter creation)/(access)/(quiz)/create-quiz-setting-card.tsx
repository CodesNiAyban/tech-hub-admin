"use client";

import { Button } from "@/components/ui/button";
import {
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { BookOpen, CopyCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import { quizCreationSchema } from "../../../../../../_utils/form-validation";

export const maxDuration = 60;

interface CreateQuizProps {
    chapterId: string
    courseId: string
    topic?: string
    onSuccess: () => void
}

export const CreateQuiz = ({ topic, chapterId, courseId, onSuccess }: CreateQuizProps) => {
    const router = useRouter();
    const { mutate: setQuizSettings, isPending } = useMutation({
        mutationFn: async ({ topic, type, amount, level }: z.infer<typeof quizCreationSchema>) => {
            const response = await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/quiz`, { topic, type, amount, level });
            if (response.status !== 200) {
                throw new Error("An error occurred, please try again later.");
            } else {
                toast.success("Quiz settings updated successfully.");
                onSuccess();
                router.refresh();
            }
            return response.data;
        },
    });

    const createForm = useForm<z.infer<typeof quizCreationSchema>>({
        resolver: zodResolver(quizCreationSchema),
        defaultValues: {
            topic: topic || "",
            amount: 3,
            type: "mcq",
            level: "HARDCORE",
        },
    });

    const onSubmit = async (data: z.infer<typeof quizCreationSchema>) => {
        setQuizSettings(data, {
            onError: (error) => {
                if (error instanceof AxiosError) {
                    if (error.response?.status === 500) {
                        toast.error("An error occurred, please try again later.");
                    }
                }
            },
        });
    };

    createForm.watch();

    return (
        <div className="overflow-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Quiz Settings</CardTitle>
                <CardDescription>
                    Configure the quiz settings for this chapter.
                </CardDescription>
                <div className="flex justify-between">
                    <Button
                        variant={
                            createForm.getValues("type") === "mcq" ? "default" : "secondary"
                        }
                        className="w-1/2 rounded-none rounded-l-lg"
                        onClick={() => {
                            createForm.setValue("type", "mcq");
                        }}
                        type="button"
                    >
                        <CopyCheck className="w-4 h-4 mr-2" /> Multiple Choice
                    </Button>
                    <Separator orientation="vertical" />
                    <Button
                        variant={
                            createForm.getValues("type") === "open_ended"
                                ? "default"
                                : "secondary"
                        }
                        className="w-1/2 rounded-none rounded-r-lg"
                        onClick={() => createForm.setValue("type", "open_ended")}
                        type="button"
                    >
                        <BookOpen className="w-4 h-4 mr-2" /> Open Ended
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <Form {...createForm}>
                    <form onSubmit={createForm.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={createForm.control}
                            name="topic"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Topic</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter a topic" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Provide the topic you would like the students to be quizzed on based on the chapter.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={createForm.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Number of Questions</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="How many questions?"
                                            type="number"
                                            {...field}
                                            onChange={(e) => {
                                                createForm.setValue("amount", parseInt(e.target.value));
                                            }}
                                            min={1}
                                            max={10}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Choose how many questions the chapter quiz will have.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={createForm.control}
                            name="level"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Level</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a level" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Easy">Easy</SelectItem>
                                                <SelectItem value="Medium">Medium</SelectItem>
                                                <SelectItem value="Hard">Hard</SelectItem>
                                                <SelectItem value="HARDCORE">HARDCORE</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormDescription>
                                        Choose the level of the quiz.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-between">
                            <Button disabled={isPending} type="submit" className="w-full">
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </div>
    );
}