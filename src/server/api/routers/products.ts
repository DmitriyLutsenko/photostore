import { z } from "zod";
import {
    createTRPCRouter,
    publicProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { db } from "~/server/db";

export interface newFile extends File {
    url?: string
}

export interface productInterface {
    pages: any | null,
    media: null | (newFile | string)[],
    fileLinks: [string],
    id: string,
    title: string,
    description: string,
    createdAt: Date,
    updatedAt: Date,
}

export const productsRouter = createTRPCRouter({

    getProducts: publicProcedure
        .query(() => {
            return db.product.findMany({
                orderBy: {
                    createdAt: 'desc'
                }
            });
        }),

    getProductById: publicProcedure
        .input(z.object({ id: z.string().nullable().optional() }).optional())
        .query(async ({ input }) => {
            const productData: productInterface[] | null = input?.id ? await db.$queryRaw`SELECT p.*, 
                    p.price as "currentPrice",
                    (SELECT JSON_OBJECTAGG(pc.configurationId, (SELECT JSON_ARRAYAGG(tpc.templateEngineId)
                                    FROM TemplateProductConfiguration tpc
                                    WHERE pc.id = tpc.productConfigurationId))
                            FROM ProductConfigurations pc
                            WHERE PC.productId = p.id) as "configurationsTemplate"
            FROM Products as p
            WHERE p.id = ${input.id}` : null;

            productData?.map(item => {
              
                item.media = JSON.parse(item.media as unknown as string) as productInterface["media"];
                item.pages = JSON.parse(item.pages as unknown as string) as productInterface["pages"];

                return item;
            })

            return productData?.[0] ?? null;
        }),
    createUpdateProduct: publicProcedure
        .input(z.object({
            title: z.string(),
            description: z.string().nullable(),
            fileLinks: z.array(z.string()).nullable().optional(),
            pages: z.any().nullable(),
            id: z.string().optional()
        }))
        .mutation(async ({ input }) => {

            try {
                const product = await (input.id
                    ? db.product.update({
                        data: {
                            title: input.title,
                            description: input.description,
                            pages: input.pages,
                            media: input?.fileLinks as [string] ?? []
                        },
                        where: {
                            id: input.id
                        }
                    })
                    : db.product.create({
                        data: {
                            title: input.title,
                            description: input.description,
                            pages: input.pages,
                            media: input?.fileLinks as [string] ?? []
                        }
                    })
                )

                if (product) {

                    if (input.id) {
                        await db.productToComponent.deleteMany({
                            where: {
                                productId: input.id,
                            }
                        })
                    }
                }
            } catch (e) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Не удалось создать новый тип! Попробуйте позже!',
                });
            }

            return input;
        }),
})