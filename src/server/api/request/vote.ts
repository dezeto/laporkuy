import { z } from "zod";

export const togglePostVoteSchema = z.object({
  postId: z.string({
    required_error: "Required",
  }),
  isUpVote: z.boolean({
    required_error: "Required",
  }),
});
