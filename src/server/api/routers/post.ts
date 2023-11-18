import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import {
  getPostByIdSchema,
  createPostSchema,
  getPostBySubjectId,
} from "../request/post";

export const postRouter = createTRPCRouter({
  getPostById: publicProcedure
    .input(getPostByIdSchema)
    .query(({ ctx, input }) => {
      return ctx.prisma.post.findUniqueOrThrow({ where: { id: input.postId } });
    }),

  getPostAndFraudsterBySubjectId: publicProcedure
    .input(getPostBySubjectId)
    .query(({ ctx, input }) => {
      return ctx.prisma.fraudster.findUniqueOrThrow({
        where: { id: input.subjectId },
        include: {
          post: true,
        },
      });
    }),

  getRelatedPostsById: publicProcedure
    .input(getPostByIdSchema)
    .query(({ ctx, input }) => {
      return ctx.prisma.post.findMany({
        where: {
          OR: [
            {
              id: input.postId,
            },
            {
              postId: input.postId,
            },
          ],
        },
        orderBy: {
          happened_at: "asc",
        },
      });
    }),

  getRelatedPostsCount: publicProcedure
    .input(getPostByIdSchema)
    .query(({ ctx, input }) => {
      return ctx.prisma.post.count({
        where: {
          postId: input.postId,
        },
      });
    }),

  createPost: publicProcedure
    .input(createPostSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.post.create({
        data: {
          postId: input.relatedPostId,
          title: input.title,
          description: input.description,
          label: input.label,
          photos: input.photos,
          happened_at: input.happennedAt,
        },
      });
    }),
});
