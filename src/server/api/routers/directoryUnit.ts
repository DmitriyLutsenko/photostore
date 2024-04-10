
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";


export interface directoryUnitInterface {
    id: string | null,
    title: string,
}

export const dirUnitRouter = createTRPCRouter({
    show: publicProcedure
        .query(() => {
            return db.directoryUnit.findMany({
                orderBy: {
                    createdAt: 'desc'
                }
            });
        }),

    getDirectoryUnitById: publicProcedure
    .input(z.object({ id: z.string().nullable().optional() }).optional())
    .query(async ({ input }) => {
        const directoryUnitData: directoryUnitInterface[] | null = input?.id ? 
        await db.$queryRaw`SELECT * 
            FROM "DirectoryUnit"
            WHERE id=${input.id}` : null;
            return directoryUnitData?.[0] ?? null;

    }),

    createUpdateDirectoryUnit: publicProcedure
        .input(z.object({
            id: z.string().optional(),
            title: z.string(),
        }))
        .mutation(async ({ input }) => {

            try {
                const directoryUnit = await (input.id
                    ? db.directoryUnit.update({
                        data: {
                            title: input.title,
                        },
                        where: {
                            id: input.id
                        }
                    })
                    : db.directoryUnit.create({
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
        return ctx.db.directoryUnit.delete({
            where: {
                id: input.id,
            }
        });
    }),

});
