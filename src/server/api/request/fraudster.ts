import { z } from "zod";

export const getByIdSchema = z.object({
  id: z.string({
    required_error: "Required",
  }),
});

export const getFraudsterByPostIdSchema = z.object({
  postId: z.string({
    required_error: "Required",
  }),
});

export const getFraudstersByNameSchema = z.object({
  name: z.string({
    required_error: "Required",
  }),
});

export const createFraudsterSchema = z.object({
  id: z.string({ required_error: "Required" }),
  postId: z.string({ required_error: "Required" }),
  name: z.string({ required_error: "Required" }),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  bankAccount: z.string().optional(),
  photo: z.string({ required_error: "Required" }),
});
