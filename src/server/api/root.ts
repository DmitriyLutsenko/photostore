import { postRouter } from "~/server/api/routers/post";
import { dirUnitRouter } from "~/server/api/routers/directoryUnit";
import { createTRPCRouter } from "~/server/api/trpc";
import { directoryNomenclatureRouter } from "./routers/directoryNomenclature";
import { dirCompTypeRouter } from "./routers/directoryComponentType";
import { productsRouter } from "./routers/products";
import { UserRouter } from "./routers/users";
import { supplierDetailRouter } from "./routers/supplierDetails";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  product: productsRouter,
  user: UserRouter,
  suppliers: supplierDetailRouter,
  directoryComponentType: dirCompTypeRouter,
  directoryUnit: dirUnitRouter,
  directoryNomenclature: directoryNomenclatureRouter,

});

// export type definition of API
export type AppRouter = typeof appRouter;
