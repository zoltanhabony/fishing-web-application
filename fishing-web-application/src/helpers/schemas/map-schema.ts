import { z } from "zod";

export const createMapSchema = z.object({
    fisheryAuthorityName: z
      .string()
      .min(1, { message: "The fishery authority name is required" })
      .refine(
        (value) => /^[a-zA-Z\u0080-\uFFFF]+/.test(value),
        "Fishery authority name should contain only alphabets"
      ),
      lat: z.number().min(-90, "The minimum lattitude can be be -90").max(90, "The maximum lattitude can be 90"),
      long: z.number().min(-180, "The minimum longitude can be -180").max(180,"The maximum longitude can be 180"),
      zoom: z.number().min(7,"The minimum magnification can be 7").max(18, "The maximum magnification can be 18"),
  });


  export const createMarkerSchema = z.object({
    mapId: z
      .string()
      .min(1, { message: "The map id is required" }),
      lat: z.number().min(-90, "The minimum lattitude can be be -90").max(90, "The maximum lattitude can be 90"),
      long: z.number().min(-180, "The minimum longitude can be -180").max(180,"The maximum longitude can be 180"),
      title: z.string().min(1, "The marker title is required"),
      info: z.string().min(1, "The marker info is required"),
      markerType: z
      .string()
      .min(1, { message: "The marker type is required" })
      .refine(
        (value) => /^[a-zA-Z\u0080-\uFFFF]+/.test(value),
        "The marker type should contain only alphabets"
      ),
  });

  export const editMapSchema = z.object({
    fisheryAuthorityId: z
      .string()
      .min(1, { message: "The authority id is required" }),
      fisheryAuthorityName: z
      .string()
      .min(1, { message: "The fishery authority name is required" })
      .refine(
        (value) => /^[a-zA-Z\u0080-\uFFFF]+/.test(value),
        "Fishery authority name should contain only alphabets"
      ),
      lat: z.number().min(-90, "The minimum lattitude can be be -90").max(90, "The maximum lattitude can be 90"),
      long: z.number().min(-180, "The minimum longitude can be -180").max(180,"The maximum longitude can be 180"),
      zoom: z.number().min(7,"The minimum magnification can be 7").max(18, "The maximum magnification can be 18"),
  });

  
  export const editMarkerSchema = z.object({
    markerId: z
      .string(),
    mapId: z
      .string()
      .min(1, { message: "The map id is required" }),
      lat: z.number().min(-90, "The minimum lattitude can be be -90").max(90, "The maximum lattitude can be 90"),
      long: z.number().min(-180, "The minimum longitude can be -180").max(180,"The maximum longitude can be 180"),
      title: z.string().min(1, "The marker title is required"),
      info: z.string().min(1, "The marker info is required"),
      markerType: z
      .string()
      .min(1, { message: "The marker type is required" })
      .refine(
        (value) => /^[a-zA-Z\u0080-\uFFFF]+/.test(value),
        "The marker type should contain only alphabets"
      ),
  });