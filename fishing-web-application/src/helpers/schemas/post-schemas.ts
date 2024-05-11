import { z } from "zod";

export const createPostSchema = z.object({
    authority: z
      .string()
      .min(1, { message: "The fishery authority name is required" })
      .refine(
        (value) => /^[a-zA-Z\u0080-\uFFFF]+/.test(value),
        "Fishery authority name should contain only alphabets"
      ),

      mainTitle:  z
      .string()
      .min(1, { message: "The main tile is required" }),

      summary:  z
      .string()
      .min(1, { message: "The summary of post is required" }),
      
      content:  z
      .string()
      .min(1, { message: "The content is required" })
      
  });

export const editPostSchema = z.object({
    id: z
    .string()
    .min(1, { message: "The post id is required" }),
    authority: z
      .string()
      .min(1, { message: "The fishery authority name is required" })
      .refine(
        (value) => /^[a-zA-Z\u0080-\uFFFF]+/.test(value),
        "Fishery authority name should contain only alphabets"
      ),

      mainTitle:  z
      .string()
      .min(1, { message: "The main tile is required" }),

      summary:  z
      .string()
      .min(1, { message: "The summary of post is required" }),
      
      content:  z
      .string()
      .min(1, { message: "The content is required" })
      
  });