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

export const codeSchema = z.object({
  code: notOnlyWhitespace("Code is required and cannot be whitespace only").max(100, {
    message: "Code cannot exceed 100 characters",
  }),
});

export const descriptionSchema = z.object({
  description: notOnlyWhitespace("Description is required and cannot be whitespace only").max(7000, {
    message: "Description cannot exceed 7000 characters",
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
    .coerce
    .number()
    .refine((val) => val >= 0, {
      message: "Price must be non-negative",
      path: ["price"],
    }),
});

export const attachmentSchema = z.object({
  url: notOnlyWhitespace("Attachment URL is required and cannot be whitespace only"),
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
