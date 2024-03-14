import { z } from "zod";
import bcrypt from 'bcrypt';
import
{
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";

export const accountRouter = createTRPCRouter({
    hello: publicProcedure
        .input(z.object({ text: z.string() }))
        .query(({ input }) =>
        {
            return {
                greeting: `Hello ${input.text}`,
            };
        }),

    create: publicProcedure.input(z.object({
        name: z.string(),
        username: z.string(),
        password: z.string(),
    })).mutation(async ({ ctx, input }) =>
    {

        const hashedPassword: string = bcrypt.hashSync(input?.password, 10);

        const createdUser = await ctx.db.user.create({
            data: {
                name: input.name,
            }
        });

        const createdAccount = await ctx.db.account.create({
            data: {
                username: input.username,
                password: hashedPassword,
                provider: 'credentials',
                scope: 'public',
                userId: createdUser.id
            }
        });

        return { ...createdUser, ...createdAccount };
    }),

    getSecretMessage: protectedProcedure.query(() =>
    {
        return "you can now see this secret message!";
    }),
});
