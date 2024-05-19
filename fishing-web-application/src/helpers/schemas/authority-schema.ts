
import { z } from "zod";

export const createAuthoritySchema = z.object({
    authorityName: z.string().min(1, {message:"The authority name is required"}).refine((value) => /^[a-zA-Z\u0080-\uFFFF]+/.test(value), 'Authority name should contain only alphabets'),
    waterAreaName: z.string().min(1, {message:"The water area name is required"}).refine((value) => /^[a-zA-Z\u0080-\uFFFF]+/.test(value), 'Water area name should contain only alphabets'),
    taxIdentifier: z.string().min(1, {message:"The tax identifier is required"}).max(11, {message:"The tax identifier contains 11 number"}).refine((value) => /^[0-9]{11}$/.test(value), 'Tax identifier should contain only number'),
    cityName: z.string().min(1, {message:"The city name is required"}).refine((value) => /^[a-zA-Z\u0080-\uFFFF]+/.test(value), 'City name should contain only alphabets'),
    streetName: z.string().min(1, {message:"The street name is required"}).refine((value) => /^[a-zA-Z\u0080-\uFFFF]+/.test(value), 'Street name should contain only alphabets'),
    streetNumber: z.number().min(1, {message:"The street number is required"}),
    floor: z.number().nullable(),
    door: z.number().nullable()
})

export const modifyAuthoritySchema = z.object({
    id: z.string().min(1, {message:"The authority id is required"}),
    authorityName: z.string().min(1, {message:"The authority name is required"}).refine((value) => /^[a-zA-Z\u0080-\uFFFF]+/.test(value), 'Authority name should contain only alphabets'),
    waterAreaName: z.string().min(1, {message:"The water area name is required"}).refine((value) => /^[a-zA-Z\u0080-\uFFFF]+/.test(value), 'Water area name should contain only alphabets'),
    taxIdentifier: z.string().min(1, {message:"The tax identifier is required"}).max(11, {message:"The tax identifier contains 11 number"}).refine((value) => /^[0-9]{11}$/.test(value), 'Tax identifier should contain only number'),
    cityName: z.string().min(1, {message:"The city name is required"}).refine((value) => /^[a-zA-Z\u0080-\uFFFF]+/.test(value), 'City name should contain only alphabets'),
    streetName: z.string().min(1, {message:"The street name is required"}).refine((value) => /^[a-zA-Z\u0080-\uFFFF]+/.test(value), 'Street name should contain only alphabets'),
    streetNumber: z.number().min(1, {message:"The street number is required"}),
    floor: z.number().nullable(),
    door: z.number().nullable()
})