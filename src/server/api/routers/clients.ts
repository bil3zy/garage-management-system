import { Items } from "@prisma/client";
import { ItemsModel, VehicleModel } from "prisma/zod";
import { z } from "zod";

import
{
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";

export const clientsRouter = createTRPCRouter({
    hello: publicProcedure
        .input(z.object({ text: z.string() }))
        .query(({ input }) =>
        {
            return {
                greeting: `Hello ${input.text}`,
            };
        }),

    update: protectedProcedure
        .input(z.object({ id: z.string(), firstName: z.string(), lastName: z.string(), phone: z.string() }))
        .mutation(async ({ ctx, input }) =>
        {
            const updatedClient = await ctx.db.client.update({
                where: {
                    id: input.id
                },
                data: {
                    firstName: input.firstName,
                    lastName: input.lastName,
                    phone: input.phone
                }
            });
            return updatedClient;
        }),

    getSecretMessage: protectedProcedure.query(() =>
    {
        return "you can now see this secret message!";
    }),
});
