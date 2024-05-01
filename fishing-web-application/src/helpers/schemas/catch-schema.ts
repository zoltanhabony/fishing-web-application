import { z } from "zod";

export const createCatchSchema = z.object({
    waterAreaName: z
      .string()
      .min(1, { message: "The water area name is required" })
      .refine(
        (value) => /^[a-zA-Z\u0080-\uFFFF]+/.test(value),
        "Water area name should contain only alphabets"
      ),
      fishId: z
      .string()
      .min(1, { message: "The fish name is required" })
      .refine(
        (value) => /^[a-zA-Z\u0080-\uFFFF]+/.test(value),
        "Fish name should contain only alphabets"
      ),

      isInjured: z.boolean(),
      isStored: z.boolean(),
      weight: z.number(),
      weightUnit: z.string().nullable(),
      piece: z.number(),
      pieceUnit: z.string().nullable(),
      length: z.number(),
      lengthUnit: z.string().nullable(),
  })
  .refine(
    (data) =>
     (data.weight === 0 && !data.weightUnit) || (data.weight !== 0 && data.weightUnit),
    {
      message:
        "If this value or the unit of measurement is given, it is mandatory to fill in the counterpart!",
      path: ["weight"],
    }
  ).refine(
    (data) =>
      (data.piece === 0 && !data.pieceUnit) || (data.piece !== 0 && data.pieceUnit),
    {
      message:
        "If this value or the unit of measurement is given, it is mandatory to fill in the counterpart!",
      path: ["piece"],
    }
  ).refine(
    (data) =>
      (data.length === 0 && !data.lengthUnit) || (data.length !== 0 && data.lengthUnit),
    {
      message:
        "If this value or the unit of measurement is given, it is mandatory to fill in the counterpart!",
      path: ["length"],
    }
  )


  export const editCatchSchema = z.object({
    userId: z.string().min(1, { message: "The user id is required" }),
    catchId: z.string().min(1, { message: "The catch id is required" }),
    pieceId: z.string().min(1, { message: "The piece id is required" }),
    weightId: z.string().min(1, { message: "The weight id is required" }),
    lengthId: z.string().min(1, { message: "The length id is required" }),

    waterAreaName: z
      .string()
      .min(1, { message: "The water area name is required" })
      .refine(
        (value) => /^[a-zA-Z\u0080-\uFFFF]+/.test(value),
        "Water area name should contain only alphabets"
      ),
      fishId: z
      .string()
      .min(1, { message: "The fish name is required" })
      .refine(
        (value) => /^[a-zA-Z\u0080-\uFFFF]+/.test(value),
        "Fish name should contain only alphabets"
      ),

      isInjured: z.boolean(),
      isStored: z.boolean(),
      weight: z.number(),
      weightUnit: z.string(),
      piece: z.number(),
      pieceUnit: z.string(),
      length: z.number(),
      lengthUnit: z.string(),
  })
  .refine(
    (data) =>
     (data.weight === 0 && !data.weightUnit) || (data.weight !== 0 && data.weightUnit),
    {
      message:
        "If this value or the unit of measurement is given, it is mandatory to fill in the counterpart!",
      path: ["weight"],
    }
  ).refine(
    (data) =>
      (data.piece === 0 && !data.pieceUnit) || (data.piece !== 0 && data.pieceUnit),
    {
      message:
        "If this value or the unit of measurement is given, it is mandatory to fill in the counterpart!",
      path: ["piece"],
    }
  )