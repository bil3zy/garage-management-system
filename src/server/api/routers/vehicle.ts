import { Items } from "@prisma/client";
import { ItemsModel, VehicleModel } from "prisma/zod";
import { z } from "zod";

import
{
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";

export const vehiclesRouter = createTRPCRouter({
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
        registrationNumber: z.string()
    })).mutation(async ({ ctx, input }) =>
    {

        const updatedVehicle = await ctx.db.vehicle.update({
            where: {
                id: input.id
            },
            data: {
                registrationNumber: input.registrationNumber
            },
        }).then((res) =>
        {
            return res;
        }).catch((err) =>
        {
            console.log(err);
        });
        return updatedVehicle;
    }),

    getSecretMessage: protectedProcedure.query(() =>
    {
        return "you can now see this secret message!";
    }),
});
