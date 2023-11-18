import { z } from "zod";

export const helloSchema = z.object({
  text: z.string({
    required_error: "Requiredd",
  }),
});

export const searchSchema = z.object({
  image: z.string({
    required_error: "Requiredd",
  }),
});

export const enrollFSchema = z.object({
  id: z.string({
    required_error: "Requiredd",
  }),
  image: z.string({
    required_error: "Requiredd",
  }),
});
