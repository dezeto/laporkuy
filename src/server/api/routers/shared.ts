import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { createPostAndFraudsterSchema } from "../request/shared";
import { v2 as cloudinary } from "cloudinary";
import { env } from "~/env.mjs";

function generateUUID() {
  // Public Domain/MIT
  var d = new Date().getTime(); //Timestamp
  var d2 =
    (typeof performance !== "undefined" &&
      performance.now &&
      performance.now() * 1000) ||
    0; //Time in microseconds since page-load or 0 if unsupported
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = Math.random() * 16; //random number between 0 and 16
    if (d > 0) {
      //Use timestamp until depleted
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      //Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export const sharedRouter = createTRPCRouter({
  createPostAndFraudster: publicProcedure
    .input(createPostAndFraudsterSchema)
    .mutation(async ({ ctx, input }) => {
      const postId = generateUUID();

      await ctx.prisma.post.create({
        data: {
          id: postId,
          postId: input.post.relatedPostId,
          title: input.post.title,
          description: input.post.description,
          label: input.post.label,
          photos: input.post.photos,
          happened_at: input.post.happennedAt,
        },
      });

      await ctx.prisma.fraudster.create({
        data: {
          id: input.fraudster.id,
          postId: postId,
          name: input.fraudster.name,
          phoneNumber: input.fraudster.phoneNumber,
          address: input.fraudster.address,
          bankAccount: input.fraudster.bankAccount,
          photo: input.fraudster.photo,
        },
      });
    }),
});
