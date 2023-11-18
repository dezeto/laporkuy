import { z } from "zod";

const createPostSchema = z.object({
  relatedPostId: z.string().optional(),
  title: z.string({ required_error: "Required" }),
  description: z.string().optional(),
  label: z.array(z.string({ required_error: "Required" })),
  photos: z.array(z.string({ required_error: "Required" })),
  happennedAt: z.date({ required_error: "Required" }),
});

const createFraudsterSchema = z.object({
  id: z.string({ required_error: "Required" }),
  name: z.string({ required_error: "Required" }),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  bankAccount: z.string().optional(),
  photo: z.string({ required_error: "Required" }),
});

export const createPostAndFraudsterSchema = z.object({
  fraudster: createFraudsterSchema,
  post: createPostSchema,
});
