import { z } from "zod";

export const createLogbookSchema = z.object({
  userName: z
    .string()
    .min(1, { message: "The user name is required" })
    .refine(
      (value) => /^[a-zA-Z\u0080-\uFFFF]+/.test(value),
      "User name should contain only alphabets"
    ),
    authorityName: z
    .string()
    .min(1, { message: "The user name is required" })
    .refine(
      (value) => /^[a-zA-Z\u0080-\uFFFF]+/.test(value),
      "User name should contain only alphabets"
    ),
});

export const modifyLogbookSchema = z.object({
  id: z.string().min(1, {message:"The authority id is required"}),
  userName: z
  .string()
  .min(1, { message: "The user name is required" })
  .refine(
    (value) => /^[a-zA-Z\u0080-\uFFFF]+/.test(value),
    "User name should contain only alphabets"
  ),
  authorityName: z
  .string()
  .min(1, { message: "The user name is required" })
  .refine(
    (value) => /^[a-zA-Z\u0080-\uFFFF]+/.test(value),
    "User name should contain only alphabets"
  ),
  expiresDate: z.date({
    required_error: "Please select a date and time",
    invalid_type_error: "That's not a date!",
  }).min(new Date(), { message: "Too young!" })
})
