import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { faceRouter } from "~/server/api/routers/face";
import { postRouter } from "~/server/api/routers/post";
import { fraudsterRouter } from "~/server/api/routers/fraudster";
import { voteRouter } from "~/server/api/routers/vote";
import { imageRouter } from "~/server/api/routers/image";
import { sharedRouter } from "~/server/api/routers/shared";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  post: postRouter,
  face: faceRouter,
  fraudster: fraudsterRouter,
  vote: voteRouter,
  image: imageRouter,
  shared: sharedRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
