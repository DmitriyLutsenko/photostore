import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";


export interface newFile extends File {
    url?: string
}

export interface directoryNomenclatureInterface {
    id: string | null,
    unitId: string | null,
    title: string,
    width?: number | null,
    height?: number | null,
    thickness?: number | null,
    fileLinks: [string],
    media: null | (newFile | string)[],
    unit: {
        id: string,
        title: string,
    } | null,
}

export const directoryNomenclatureRouter = createTRPCRouter({

    getDirectoryNomenclatures: publicProcedure
        .query(() => {
            return db.directoryNomenclature.findMany({
                orderBy: {
                    createdAt: 'desc'
                },
                include: {
                    unit: {
                        select: {
                        title: true,
                    }},
                },
            });
        }),


        getDirectoryNomenclatureById: publicProcedure
        .input(z.object({ id: z.string().nullable().optional() }).optional())
        .query(async ({ input }) => {
            const DirectoryComponentTypeData: directoryNomenclatureInterface[] | null = input?.id ? 
            await db.$queryRaw`SELECT * 
                FROM "DirectoryNomenclature"
                WHERE id=${input.id}` : null;
                return DirectoryComponentTypeData?.[0] ?? null;
    
        }),
    

   /* getDirectoryNomenclatureById: publicProcedure
        .input(z.object({ id: z.string().nullable().optional() }).optional())
        .query(async ({ input }) => {
         const directoryNomenclatureData: directoryNomenclatureInterface[] | null 
            = input?.id ? await db.$queryRaw`SELECT *
            FROM "DirectoryNomenclature"
            WHERE id=${input.id}` : null;

            directoryNomenclatureData?.map(item => {

                item.unit = JSON.parse(item.unit as unknown as string) as directoryNomenclatureInterface["unit"];
                item.media = JSON.parse(item.media as unknown as string) as directoryNomenclatureInterface["media"];

                return item;
            })

            return directoryNomenclatureData?.[0] ?? null;
        }),
        */
        createUpdateDirectoryNomenclature: publicProcedure
            .input(z.object({
                title: z.string(),
                width: z.number().optional(),
                height: z.number().optional(),
                thickness: z.number().optional(),
                fileLinks: z.array(z.string()).nullable().optional(),
                unitId: z.string().nullable(),
                id: z.string().optional()
            }))
            .mutation(async ({ input }) => {

                try {
                    console.log("Что в инпуте?")
                    console.log(input);

                    const directoryNomenclature = await (input.id
                        ? db.directoryNomenclature.update({
                            data: {
                                title: input.title,
                                width: input.width,
                                height: input.height,
                                thickness: input.thickness,
                                unitId: input.unitId,
                                media: input?.fileLinks as [string] ?? []
                            },
                            where: {
                                id: input.id
                            }
                        })
                        : db.directoryNomenclature.create({
                            data: {
                                title: input.title,
                                width: input.width,
                                height: input.height,
                                thickness: input.thickness,
                                unitId: input.unitId,
                                media: input?.fileLinks as [string] ?? []
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
    
});
