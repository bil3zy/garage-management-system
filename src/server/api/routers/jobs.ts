import { z } from "zod";

import
{
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";

export const jobsRouter = createTRPCRouter({
    findAll: protectedProcedure.query(async ({ ctx }) =>
    {

        const finalJobsArr: {
            id: string | null | undefined;
            firstName: string | null | undefined;
            lastName: string | null | undefined;
            phone: string | null | undefined;
            registrationNumber: string | null | undefined;
            price: string | null | undefined;
            subRows: {
                items: any;
                workers: any;
            };
        }[] = [];

        const foundJobs = await ctx.db.jobs.findMany({
            include: {
                client: true,
                items: true,
                vehicle: true,
            }
        }).then((jobsRes) =>
        {


            jobsRes.map((job) =>
            {
                const jobObject = {
                    id: job.id,
                    firstName: job.client?.firstName,
                    lastName: job.client?.lastName,
                    phone: job.client?.phone,
                    registrationNumber: job.vehicle?.registrationNumber,
                    price: job.price,
                    subRows: {
                        items: [...job.items],
                        workers: job.worker
                    },
                };
                finalJobsArr.push(jobObject);
            });

        });
        console.log('finalJobsArr', finalJobsArr);
        return finalJobsArr;


        // const jobs = {
        //     client: foundJobs.map((job) => job.client),
        //     vehicle: foundJobs.map((job) => job.vehicle),
        //     price: foundJobs.map((job) => job.price),
        //     subRows: {
        //         items: foundJobs.map((job) => job.items),
        //         workers: foundJobs.map((job) => job.worker),
        //     }
        // };
        // console.log('jobs', jobs);
        // if(foundJobs)
        //         return foundJobs;
    }),
    create: protectedProcedure
        .input(z.object({ name: z.string().min(1) }))
        .mutation(async ({ ctx, input }) =>
        {
            // simulate a slow db call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            return ctx.db.post.create({
                data: {
                    name: input.name,
                    createdBy: { connect: { id: ctx.session.user.id } },
                },
            });
        }),

    getLatest: protectedProcedure.query(({ ctx }) =>
    {
        return ctx.db.post.findFirst({
            orderBy: { createdAt: "desc" },
            where: { createdBy: { id: ctx.session.user.id } },
        });
    }),

    getSecretMessage: protectedProcedure.query(() =>
    {
        return "you can now see this secret message!";
    }),
});
