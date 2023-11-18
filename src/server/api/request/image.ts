import { z } from "zod";

export const uploadImageSchema = z.object({
  images: z.array(z.string({ required_error: "Required" })),
});
