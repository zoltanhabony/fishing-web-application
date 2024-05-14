import { changeRank } from "@/actions";
import { z } from "zod";

export const createTournamentSchema = z.object({
  fisheryAuthorityName: z
    .string()
    .min(1, { message: "The authority name is required" })
    .refine(
      (value) => /^[a-zA-Z\u0080-\uFFFF]+/.test(value),
      "Authority name should contain only alphabets"
    ),
  tournamentName: z
    .string()
    .min(1, { message: "The tournament name is required" })
    .refine(
      (value) => /^[a-zA-Z\u0080-\uFFFF]+/.test(value),
      "Tournament name should contain only alphabets"
    ),
    maxParticipants: z.number().min(2, "Minimum two people must enter to create a fishing tournament"),
  tournamentType: z.string(),
  tournamentDescription: z.string(),

  deadline: z
    .date({
      required_error: "Please select a date and time",
      invalid_type_error: "That's not a date!",
    })
    .min(new Date(), {
      message: "The deadline must be at least today's date!",
    }),

  startDate: z
    .date({
      required_error: "Please select a date and time",
      invalid_type_error: "That's not a date!",
    })
    .min(new Date(), {
      message: "The start date must be at least today's date!",
    }),
    fishId: z.string().nullable()
});


export const applyForTournamentSchema = z.object({
  id: z
    .string()
    .min(1, { message: "The authority name is required" })
});

export const editTournamentSchema = z.object({
  id: z
    .string()
    .min(1, { message: "The authority name is required" }),
  fisheryAuthorityName: z
    .string()
    .min(1, { message: "The authority name is required" })
    .refine(
      (value) => /^[a-zA-Z\u0080-\uFFFF]+/.test(value),
      "Authority name should contain only alphabets"
    ),
  tournamentName: z
    .string()
    .min(1, { message: "The tournament name is required" })
    .refine(
      (value) => /^[a-zA-Z\u0080-\uFFFF]+/.test(value),
      "Tournament name should contain only alphabets"
    ),
    maxParticipants: z.number().min(2, "Minimum two people must enter to create a fishing tournament"),
  tournamentType: z.string(),
  tournamentDescription: z.string(),

  deadline: z
    .date({
      required_error: "Please select a date and time",
      invalid_type_error: "That's not a date!",
    })
    .min(new Date(), {
      message: "The deadline must be at least today's date!",
    }),

  startDate: z
    .date({
      required_error: "Please select a date and time",
      invalid_type_error: "That's not a date!",
    })
    .min(new Date(), {
      message: "The start date must be at least today's date!",
    }),
    fishId: z.string().nullable(),
    isFinished: z.boolean()
});

export const changeRankSchema = z.object({
  tournamentId: z
    .string()
    .min(1, { message: "The torunament id is required" }),
    ranks: z
    .string()
    .min(1, { message: "The ranks is required" })
});
