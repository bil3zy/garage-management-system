import { Items } from "@prisma/client";
import { ItemsModel } from "prisma/zod";
import { z } from "zod";

import
{
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";

export const itemRouter = createTRPCRouter({
    hello: publicProcedure
        .input(z.object({ text: z.string() }))
        .query(({ input }) =>
        {
            return {
                greeting: `Hello ${input.text}`,
            };
        }),

    update: protectedProcedure.input(z.object({
        id: z.string(),
        name: z.string(),
        price: z.number(),
        broughtBy: z.string(),
    })).mutation(async ({ ctx, input }) =>
    {
        const updatedItem = await ctx.db.items.update({
            where: {
                id: input.id
            },
            data: {
                name: input.name,
                price: input.price,
                broughtBy: input.broughtBy,
            },
        }).then((res) =>
        {
            return res;
        }).catch((err) =>
        {
            console.log(err);
        });
        return updatedItem;
    }),
    create: protectedProcedure.input(z.object({
        items: ItemsModel.omit({ id: true, createdAt: true, updatedAt: true })
    })
    ).mutation(async ({ ctx, input }) =>
    {
        const createdItem = await ctx.db.items.create({
            data: {
                broughtBy: input.items.broughtBy,
                name: input.items.name,
                price: input.items.price,
                jobId: input.items.jobId,
            },
        }).then((res) =>
        {
            return res;
        }).catch((err) =>
        {
            console.log(err);
        });
        return createdItem;
    }),
    getSecretMessage: protectedProcedure.query(() =>
    {
        return "you can now see this secret message!";
    }),
});
