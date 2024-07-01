"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"; // Import Tooltip component
import { zodResolver } from "@hookform/resolvers/zod"
import { Chapter } from "@prisma/client"
import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query'
import axios from "axios"
import { Cog } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"
import { quizAccessSchema } from "../../../../../../_utils/form-validation"
import { CreateQuiz } from "./create-quiz-setting-card";

const queryClient = new QueryClient()

// Define the component props
interface EditChapterQuizProps {
  initialData: Chapter;
  courseId: string;
  chapterId: string;
  formLabel: string;
}

// Define the form component
export function EditChapterQuizForm({
  initialData,
  courseId,
  chapterId,
  formLabel,
}: EditChapterQuizProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDialog, setShowDialog] = useState(false)

  const form = useForm<z.infer<typeof quizAccessSchema>>({
    resolver: zodResolver(quizAccessSchema),
    defaultValues: {
      quiz: initialData.quiz,
    },
  })

  const editQuiz = async (values: z.infer<typeof quizAccessSchema>) => {
    setIsSubmitting(true)
    try {
      const response = await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values)
      router.refresh()
      return response
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  const onSubmit = async (values: z.infer<typeof quizAccessSchema>) => {
    try {
      const response = toast.promise(editQuiz(values), {
        loading: "Processing",
        error: "An error occurred, please try again later.",
        success: "Chapter Quiz Updated!",
      })
      return response
    } catch (error) {
      console.log(error)
    }
  }

  const handleSwitchChange = (checked: boolean) => {
    form.setValue('quiz', checked);
    if (!checked) form.handleSubmit(onSubmit)();
    setShowDialog(checked);
  }

  const handleDialogOpenChange = (isOpen: boolean) => {
    setShowDialog(isOpen);
    if (!isOpen && !initialData.quiz) {
      form.setValue('quiz', false);
    }
  };

  return (
    <div className="mt-4">
      <Form {...form}>
        <form
          className="w-full space-y-6"
        >
          <div>
            <h3 className="mb-4 text-md font-medium">{formLabel}</h3>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="quiz"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Enable Quiz</FormLabel>
                      <FormDescription>
                        Toggle to enable or disable the quiz for this chapter.
                      </FormDescription>
                    </div>
                    <div className="flex flex-row items-center">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={handleSwitchChange}
                          data-testid="quiz-creation"
                        />
                      </FormControl>
                      {field.value && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Cog
                                className="h-6 w-6 ml-2 cursor-pointer hover:text-primary"
                                onClick={() => setShowDialog(true)}
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Click to Edit Quiz Settings</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>

      <Dialog open={showDialog} onOpenChange={handleDialogOpenChange}>
        <DialogContent>
          <QueryClientProvider client={queryClient}>
            <CreateQuiz
              topic={initialData.title}
              courseId={courseId}
              chapterId={chapterId}
              onSuccess={() => setShowDialog(false)}
            />
          </QueryClientProvider>
        </DialogContent>
      </Dialog>
    </div>
  )
}
