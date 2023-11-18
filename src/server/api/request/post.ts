import { z } from "zod";

export const getPostByIdSchema = z.object({
  postId: z.string({
    required_error: "Required",
  }),
});

export const getPostBySubjectId = z.object({
  subjectId: z.string({
    required_error: "Required",
  }),
});

export const createPostSchema = z.object({
  relatedPostId: z.string().optional(),
  title: z.string({ required_error: "Required" }),
  description: z.string().optional(),
  label: z.array(z.string({ required_error: "Required" })),
  photos: z.array(z.string({ required_error: "Required" })),
  happennedAt: z.date({ required_error: "Required" }),
});
