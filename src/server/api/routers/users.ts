import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";
import { newFile } from "./directoryNomenclature";
import { type supplierDetailInterface } from "./supplierDetails";


export interface UsersInterface {
    id: string | undefined,
    name: string,
    email: string,
    emailVerified: Date | null,
    image: undefined | string,
    password: string,
    level: number,
}

export const UserRouter = createTRPCRouter({
    show: publicProcedure
        .query(() => {
            return db.user.findMany({
                orderBy: {
                    createdAt: 'desc'
                }
            });
        }),

    getUserById: publicProcedure
    .input(z.object({ id: z.string().nullable().optional() }).optional())
    .query(async ({ input }) => {
        const userData: UsersInterface[] | null = input?.id ? 
        await db.$queryRaw`
            SELECT u.*
            FROM "User" as u WHERE u.id= ${input.id}` : null;
            userData?.map(item => {
                item.image = JSON.parse(item.image as unknown as string) as UsersInterface["image"];
                return item;
            });

            return userData?.[0] ?? null;
    }),

    createUpdateUser: publicProcedure
        .input(z.object({
            id: z.string().optional(),
            name: z.string(),
            email: z.string(),
            image: z.string().optional(),
            password: z.string(),
            level: z.number().default(10),
            supplierDetails: z.array(z.string()).optional(),
        }))
        .mutation(async ({ input }) => {

            try {
                const user = await (input.id
                    ? db.user.update({
                        data: {
                            name: input.name,
                            email: input.email,
                            image: input.image,
                            password: input.password,
                            level: input.level,
                        },
                        where: {
                            id: input.id
                        }
                    })
                    : db.user.create({
                        data: {
                            name: input.name,
                            email: input.email,
                            image: input.image,
                            password: input.password,
                            level: input.level,
                        }
                    })
                )
            } catch (e) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Не удалось создать пользователя! Попробуйте позже!',
                });
            }

            return input;
        }),

    delete: publicProcedure
    .input(z.object({id: z.string().min(1)}))
    .mutation(async ({ctx, input}) => {
        return ctx.db.user.delete({
            where: {
                id: input.id,
            }
        });
    }),

});
