import { postRouter } from "~/server/api/routers/post";
import { createTRPCRouter } from "~/server/api/trpc";
import { accountRouter } from "./routers/account";
import { jobsRouter } from "./routers/jobs";
import { itemRouter } from "./routers/items";
import { mechanicRouter } from "./routers/mechanic";
import { vehiclesRouter } from "./routers/vehicle";
import { clientsRouter } from "./routers/clients";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  account: accountRouter,
  jobs: jobsRouter,
  items: itemRouter,
  mechanic: mechanicRouter,
  vehicle: vehiclesRouter,
  client: clientsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
