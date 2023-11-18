import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import {
  getFraudstersByNameSchema,
  getFraudsterByPostIdSchema,
  getByIdSchema,
  createFraudsterSchema,
} from "../request/fraudster";

export const fraudsterRouter = createTRPCRouter({
  getById: protectedProcedure
    .input(getByIdSchema)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.fraudster.findUniqueOrThrow({
        where: { id: input.id },
      });
    }),

  getFraudsterByPostId: protectedProcedure
    .input(getFraudsterByPostIdSchema)
    .query(({ ctx, input }) => {
      return ctx.prisma.fraudster.findUniqueOrThrow({
        where: { postId: input.postId },
      });
    }),

  getFraudstersByName: protectedProcedure
    .input(getFraudstersByNameSchema)
    .query(({ ctx, input }) => {
      return ctx.prisma.fraudster.findMany({
        where: {
          name: { contains: input.name },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),
});
