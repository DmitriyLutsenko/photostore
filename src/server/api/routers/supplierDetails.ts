import { z } from "zod";
import {
    createTRPCRouter,
    publicProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { db } from "~/server/db";

export interface supplierDetailInterface {
    id: string,
    userId: string,
    email: string,
    phone: string,
    organization: string,
    agreement: string,
    unp: string,
    checkingAccount: string
    bankCode: string,
}

export const supplierDetailRouter = createTRPCRouter({

    showById: publicProcedure
    .input(z.object({ id: z.string().nullable().optional() }).optional())
    .query(async ({ input }) => {
        const supplierDetailData: supplierDetailInterface[] | null = input?.id ? 
        await db.$queryRaw`SELECT * 
            FROM "SupplierDetail"
            WHERE id=${input.id}` : null;
            return supplierDetailData?.[0] ?? null;
    }),

    showSuppliersByUserId: publicProcedure
    .input(z.object({ id: z.string().nullable().optional() }).optional())
    .query(async ({ input }) => {
        const supplierDetailData: supplierDetailInterface[] | null = input?.id ? 
        await db.$queryRaw`SELECT * 
            FROM "SupplierDetail"
            WHERE "userId"=${input.id}` : null;
            return supplierDetailData ?? null;
    }),

    createUpdateSupplierDetail: publicProcedure
            .input(z.object({
                id: z.string().nullable().optional(),
                userId: z.string(),
                email: z.string(),
                phone: z.string(),
                organization: z.string(),
                agreement: z.string(),
                unp: z.string(),
                checkingAccount: z.string(),
                bankCode: z.string(),
            }))
            .mutation(async ({ input }) => {

                try {
                    console.log("Что в инпуте?")
                    console.log(input);

                    const SupplierDetail = await (input.id
                        ? db.supplierDetail.update({
                            data: {
                                userId: input.userId,
                                email: input.email,
                                phone: input.phone,
                                organization: input.organization,
                                agreement: input.agreement,
                                unp: input.unp,
                                checkingAccount: input.checkingAccount,
                                bankCode: input.bankCode,
                            },
                            where: {
                                id: input.id
                            }
                        })
                        : db.supplierDetail.create({
                            data: {
                                userId: input.userId,
                                email: input.email,
                                phone: input.phone,
                                organization: input.organization,
                                agreement: input.agreement,
                                unp: input.unp,
                                checkingAccount: input.checkingAccount,
                                bankCode: input.bankCode,
                            }
                        })
                    )

                } catch (e) {
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: 'Не удалось создать профиль поставщика!',
                    });
                }

                return input;
            }),
    

});