
import { z } from "zod";

export const credentialLoginSchema = z.object({
    email: z
      .string()
      .min(1,{
        message: "The email is required",
      }).email("The email is invalid"),
    password: z.string().min(1, {message: "The password is required"}),
    code: z.optional(z.string()).nullable()
  });

  export const credentialRegistrationSchema = z.object({
    username: z.string().min(1, {message:"The username is required"}).min(3, {message:"The username must be contain three caracther and starts with letter"}).refine((value) => /^[a-zA-Z\u0080-\uFFFF]+/.test(value), 'Name should contain only alphabets'),
    email: z
      .string()
      .min(1,{
        message: "The email is required",
      }).email("The email is invalid"),
    password: z.string().min(1, {message: "The password is required"}).min(8, {message: "The password must be 8 carachter length"}).refine((value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value), 'Password must have contains, at least one letter, one number and one special character'),
    confirmPassword: z.string().min(1, {message: "The password is required"}).min(8, {message: "The password must be 8 carachter length"}),
    accountType: z.string().min(1, {message: "Choose an account type"}).nullish()
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export const passwordResetSchema = z.object({
  email: z
    .string()
    .min(1,{
      message: "The email is required",
    }).email("The email is invalid"),
});

export const newPasswordSchema = z.object({
  password: z.string().min(1, {message: "The password is required"}).min(8, {message: "The password must be 8 carachter length"}).refine((value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value), 'Password must have contains, at least one letter, one number and one special character'),
  confirmPassword: z.string().min(1, {message: "The password is required"}).min(8, {message: "The password must be 8 carachter length"}),
  token: z.string().nullable()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const settingsSchema = z.object({
    username: z.optional(z.string().min(1, {message:"The username is required"}).min(3, {message:"The username must be contain three caracther and starts with letter"}).refine((value) => /^[a-zA-Z\u0080-\uFFFF]+/.test(value), 'Name should contain only alphabets')),
    firstName: z.optional(z.string().min(1, {message:"The username is required"}).min(3, {message:"The username must be contain three caracther and starts with letter"}).refine((value) => /^[a-zA-Z\u0080-\uFFFF]+/.test(value), 'Name should contain only alphabets')),
    lastName: z.optional(z.string().min(1, {message:"The username is required"}).min(3, {message:"The username must be contain three caracther and starts with letter"}).refine((value) => /^[a-zA-Z\u0080-\uFFFF]+/.test(value), 'Name should contain only alphabets'))
})

export const memberSchema = z.object({
  memberId:z.string().min(1, {message:"The member id is required"}),
  email: z
      .string()
      .min(1,{
        message: "The email is required",
      }).email("The email is invalid"),
  username: z.optional(z.string().min(1, {message:"The username is required"}).min(3, {message:"The username must be contain three caracther and starts with letter"}).refine((value) => /^[a-zA-Z\u0080-\uFFFF]+/.test(value), 'Name should contain only alphabets')),
  firstName: z.optional(z.string().min(1, {message:"The username is required"}).min(3, {message:"The username must be contain three caracther and starts with letter"}).refine((value) => /^[a-zA-Z\u0080-\uFFFF]+/.test(value), 'Name should contain only alphabets')),
  lastName: z.optional(z.string().min(1, {message:"The username is required"}).min(3, {message:"The username must be contain three caracther and starts with letter"}).refine((value) => /^[a-zA-Z\u0080-\uFFFF]+/.test(value), 'Name should contain only alphabets')),
  role: z.optional(z.string().min(1, {message:"The role is required"}).min(3, {message:"The role must be USER or INSPECTOR"}).refine((value) => /^[a-zA-Z\u0080-\uFFFF]+/.test(value), 'The role should contain only alphabets'))
})

export const userPermissonSchema = z.object({
  memberId:z.string().min(1, {message:"The member id is required"}),
  accessToFishing: z.boolean(),
  accessToLogbook: z.boolean(),
  accessToMarker: z.boolean(),
  accessToTournament: z.boolean(),
})

export const inspectorPermissonSchema = z.object({
  memberId:z.string().min(1, {message:"The member id is required"}),
  accessToFishing: z.boolean(),
  accessToLogbook: z.boolean(),
  accessToAuthority: z.boolean(),
  accessToCatch: z.boolean(),
  accessToTournament: z.boolean(),
  accessToPost: z.boolean(),
  accessToMarker: z.boolean(),
  accessToInspect: z.boolean(),
})

