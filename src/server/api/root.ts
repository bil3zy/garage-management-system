import { postRouter } from "~/server/api/routers/post";
import { createTRPCRouter } from "~/server/api/trpc";
import { accountRouter } from "./routers/account";
import { jobsRouter } from "./routers/jobs";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  account: accountRouter,
  jobs: jobsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
