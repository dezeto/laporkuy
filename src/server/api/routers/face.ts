import { FaceSearchResponse, SearchResult } from "./../response/face";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { searchSchema, enrollFSchema } from "../request/example";
import { v2 as cloudinary } from "cloudinary";
import { env } from "~/env.mjs";
import axios from "axios";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

const axios_instance = axios.create({
  baseURL: env.BASE_FACE_SERVICE_URL,
  headers: {
    "App-ID": env.APP_ID,
    "API-Key": env.API_KEY,
  },
});

interface FieldDatas {
  image?: string;
  publicId?: string;
  height?: number;
  width?: number;
}

export const faceRouter = createTRPCRouter({
  search: publicProcedure
    .input(searchSchema)
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { image } = input;

      const attributes = {
        image,
        limit: 5,
        return_image: true,
        threshold: 50,
        is_quality: false,
        is_attribute: false,
        is_liveness: false,
        validate_quality: false,
        validate_attribute: false,
        validate_liveness: false,
      };
      const result = await axios_instance.post("/v1/face/search", attributes);

      const response = (result.data?.matches as []).map((val) =>
        FaceSearchResponse.fromJSON(val)
      );

      const searchResults: SearchResult[] = (
        await Promise.all(
          response.map(async (res) => {
            const fraudster = await prisma.fraudster.findFirst({
              where: { id: res.subject_id },
            });
            if (fraudster)
              return {
                id: res.subject_id,
                name: fraudster.name,
                similarity: res.similarity,
                image: fraudster.photo,
                postId: fraudster.postId,
              };
          })
        )
      ).filter((result): result is SearchResult => result !== undefined);

      return searchResults;
    }),

  enrollUser: protectedProcedure
    .input(searchSchema)
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { image } = input;
      let data: FieldDatas = {};

      const userId = session.user.id;
      const attributes = {
        image,
        subject_id: userId,
        is_quality: false,
        is_attribute: false,
        is_liveness: true,
        validate_quality: false,
        validate_attribute: false,
        validate_liveness: true,
      };

      const result = await axios_instance.post("/v1/face/enroll", attributes);
      if (result.status === 200) {
        await cloudinary.uploader.upload(
          image,
          async (err_c: any, result: any) => {
            data = {
              image: result?.secure_url as string,
              publicId: result?.public_id as string,
              height: result?.height as number,
              width: result?.width as number,
            };
            await prisma.user.update({
              where: {
                id: userId,
              },
              data: {
                enrolled_image: data.image,
              },
            });
            return "Success";
          }
        );
      } else {
        return result.data;
      }
    }),
  enrollFrauster: protectedProcedure
    .input(enrollFSchema)
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { image, id } = input;

      const attributes = {
        image,
        subject_id: id,
        is_quality: false,
        is_attribute: false,
        is_liveness: true,
        validate_quality: false,
        validate_attribute: false,
        validate_liveness: true,
      };
      const result = await axios_instance.post("/v1/face/enroll", attributes);
      if (result.status === 200) {
        return "Success";
      }
      return "Failed";
    }),
});
