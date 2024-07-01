import { z } from "zod";

const notOnlyWhitespace = (message: string) =>
  z.string().regex(/^\S.*\S$/i, {
    message: message,
  });

export const titleSchema = z.object({
  title: notOnlyWhitespace("Title is required and cannot be whitespace only").max(100, {
    message: "Title cannot exceed 100 characters",
  }),
});

export const createSchema = z.object({
  title: notOnlyWhitespace("Title is required and cannot be whitespace only").max(100, {
    message: "Title cannot exceed 100 characters",
  }),
});

export const descriptionSchema = z.object({
  description: notOnlyWhitespace("Description is required and cannot be whitespace only").max(7000, {
    message: "Description cannot exceed 7000 characters",
  }),
});

export const commentSchema = z.object({
  comment: notOnlyWhitespace("Description is required and cannot be whitespace only").max(1000, {
    message: "Comments cannot exceed 1000 characters",
  }),
});


export const imageSchema = z.object({
  imageUrl: notOnlyWhitespace("Image URL is required and cannot be whitespace only"),
});

export const categoriesSchema = z.object({
  categories: z
    .array(z.string().min(1))
    .min(1)
    .nonempty("Please select at least one category."),
});

export const priceSchema = z.object({
  price: z
    .union([z.string(), z.number()])
    .refine((val) => !isNaN(Number(val)), {
      message: "Price must be a valid number",
      path: ["price"],
    })
    .transform((val) => Number(val))
    .refine((val) => val >= 0, {
      message: "Price must be non-negative",
      path: ["price"],
    }),
});

export const attachmentSchema = z.object({
  url: notOnlyWhitespace("Attachment URL is required and cannot be whitespace only"),
});

export const moduleSchema = z.object({
  pdfUrl: notOnlyWhitespace("Attachment URL is required and cannot be whitespace only"),
});

export const chapterSchema = z.object({
  title: notOnlyWhitespace("Chapter title is required and cannot be whitespace only").max(100, {
    message: "Chapter title cannot exceed 100 characters",
  }),
});

export const accessSchema = z.object({
  subscription: notOnlyWhitespace("Subscription type is required and cannot be whitespace only"),
});

export const videoSchema = z.object({
  videoUrl: notOnlyWhitespace("Video URL is required and cannot be whitespace only"),
});

export const quizAccessSchema = z.object({
  quiz: z.boolean(),
});

export const quizCreationSchema = z.object({
  topic: z
    .string()
    .min(4, {
      message: "Topic must be at least 4 characters long",
    })
    .max(50, {
      message: "Topic must be at most 50 characters long",
    }),
  type: z.enum(["mcq", "open_ended"]),
  amount: z.number().min(1).max(10),
  level: z.enum(["Easy", "Medium", "Hard","HARDCORE"]),
});


export const getQuestionsSchema = z.object({
  topic: z.string(),
  amount: z.number().int().positive().min(1).max(10),
  type: z.enum(["mcq", "open_ended"]),
});

export const checkAnswerSchema = z.object({
  userInput: z.string(),
  questionId: z.string(),
});

export const endGameSchema = z.object({
  gameId: z.string(),
});

export const chapterQuizSchema = z.object({
  topic: z
    .string()
    .min(4, {
      message: "Topic must be at least 4 characters long",
    })
    .max(50, {
      message: "Topic must be at most 50 characters long",
    }),
  type: z.enum(["mcq", "open_ended"]),
  amount: z.number().min(1).max(10),
  level: z.enum(["Easy", "Medium", "Hard", "HARDCORE"]),
  courseTitle: notOnlyWhitespace("Course title is required and cannot be whitespace only").max(100, {
    message: "Course title cannot exceed 100 characters",
  }),
  chapterTitle: notOnlyWhitespace("Chapter title is required and cannot be whitespace only").max(100, {
    message: "Chapter title cannot exceed 100 characters",
  }),
  courseDescription: notOnlyWhitespace("Course description is required and cannot be whitespace only").max(7000, {
    message: "Course description cannot exceed 7000 characters",
  }),
  chapterDescription: notOnlyWhitespace("Chapter description is required and cannot be whitespace only").max(7000, {
    message: "Chapter description cannot exceed 7000 characters",
  }),
});