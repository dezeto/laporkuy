import { FaceSearchResponse } from "./../response/face";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { uploadImageSchema } from "../request/image";
import { v2 as cloudinary } from "cloudinary";
import { env } from "~/env.mjs";
import { Console } from "console";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export const imageRouter = createTRPCRouter({
  uploadImages: protectedProcedure
    .input(uploadImageSchema)
    .mutation(async ({ ctx, input }) => {
      const { images } = input;
      const urls: string[] = [];

      const image = images[0];

      if (image) {
        console.log(image);
        await cloudinary.uploader.upload(
          image,
          async (err_c: any, result: any) => {
            console.log(result);
            console.log(result?.secure_url);
            urls.push(result?.secure_url);
          }
        );
      }

      return urls;

      // loop imagea and call upload
      // for (let i = 0; i < images.length; i++) {
      //   const image = images[i];
      //   console.log("image from server");
      //   console.log(image);
      //   if (image) {
      //     const upload = await cloudinary.uploader.upload(
      //       image,
      //       async (err_c: any, result: any) => {
      //         console.log(result);
      //         console.log(result.secure_url);
      //         urls.push(result.secure_url);
      //       }
      //     );
      //     // console.log("upload");
      //     // console.log(upload);
      //     // console.log(upload.secure_url);
      //   }
      // }

      // const result = await images.map(async (image) => {
      //   const upload = await cloudinary.uploader.upload(
      //     image,
      //     async (err_c: any, result: any) => {
      //       console.log(result);
      //       return result.secure_url;
      //     }
      //   );
      //   console.log("upload");
      //   console.log(upload);
      //   return upload;
      // });
      // console.log(result);
      // return result;
    }),
});
