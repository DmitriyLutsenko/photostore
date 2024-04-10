import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";


export interface directoryComponentTypeInterface {
    id: string | null,
    title: string,
}

export const dirCompTypeRouter = createTRPCRouter({
    show: publicProcedure
        .query(() => {
            return db.directoryComponentType.findMany({
                orderBy: {
                    createdAt: 'desc'
                }
            });
        }),

    getDirectoryComponentTypeById: publicProcedure
    .input(z.object({ id: z.string().nullable().optional() }).optional())
    .query(async ({ input }) => {
        const DirectoryComponentTypeData: directoryComponentTypeInterface[] | null = input?.id ? 
        await db.$queryRaw`SELECT * 
            FROM "DirectoryComponentType"
            WHERE id=${input.id}` : null;
            return DirectoryComponentTypeData?.[0] ?? null;

    }),

    createUpdateDirectoryComponentType: publicProcedure
        .input(z.object({
            id: z.string().optional(),
            title: z.string(),
        }))
        .mutation(async ({ input }) => {

            try {
                const directoryComponentType = await (input.id
                    ? db.directoryComponentType.update({
                        data: {
                            title: input.title,
                        },
                        where: {
                            id: input.id
                        }
                    })
                    : db.directoryComponentType.create({
                        data: {
                            title: input.title,
                        }
                    })
                )
            } catch (e) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Не удалось создать новый тип! Попробуйте позже!',
                });
            }

            return input;
        }),

    delete: publicProcedure
    .input(z.object({id: z.string().min(1)}))
    .mutation(async ({ctx, input}) => {
        return ctx.db.directoryComponentType.delete({
            where: {
                id: input.id,
            }
        });
    }),

});
