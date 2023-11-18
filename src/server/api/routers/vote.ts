import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { togglePostVoteSchema } from "../request/vote";

export const voteRouter = createTRPCRouter({
  togglePostVote: publicProcedure
    .input(togglePostVoteSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.vote.upsert({
        where: {
          voteId: {
            postId: input.postId,
            userId:
              ctx.session?.user.id || "61b84815-b4db-429d-90e0-56d40d83151a",
          },
        },
        update: {
          isUpVote: input.isUpVote,
        },
        create: {
          postId: input.postId,
          isUpVote: input.isUpVote,
          userId:
            ctx.session?.user.id || "61b84815-b4db-429d-90e0-56d40d83151a",
        },
      });
    }),
});
