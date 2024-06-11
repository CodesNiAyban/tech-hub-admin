import { z } from "zod";

export const titleSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }).max(100, {
    message: "Title cannot exceed 100 characters",
  }),
});

export const createSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }).max(100, {
    message: "Title cannot exceed 100 characters",
  }),
});

export const descriptionSchema = z.object({
  description: z.string().min(1, {
    message: "Description is required",
  }).max(2000, {
    message: "Description cannot exceed 2000 characters",
  }),
});

export const imageSchema = z.object({
  imageUrl: z.string().min(1, {
    message: "Image is required",
  }),
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
  url: z.string().min(1, {
    message: "Attachment is required",
  }),
});

export const chapterSchema = z.object({
  title: z.string().min(1).max(100, {
    message: "Chapter title cannot exceed 100 characters",
  }),
});

export const accessSchema = z.object({
  isFree: z.boolean().default(false),
});

export const videoSchema = z.object({
  videoUrl: z.string().min(1),
});
