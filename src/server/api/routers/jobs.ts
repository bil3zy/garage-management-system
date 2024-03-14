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
            id: string;
            firstName: string;
            lastName: string;
            phone: string;
            registrationNumber: string;
            price: string;
            subRows: {
                items: {
                    id: string;
                    name: string | null;
                    broughtBy: string | null;
                    price: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    jobId: string | null;
                }[];
                workers: string;
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
                    firstName: job.client?.firstName ?? "",
                    lastName: job.client?.lastName ?? "",
                    phone: job.client?.phone ?? "",
                    registrationNumber: job.vehicle?.registrationNumber ?? "",
                    price: job.price ?? "",
                    subRows: {
                        items: job.items,
                        workers: job.worker ?? ""
                    },
                };
                finalJobsArr.push(jobObject);
            });

        });
        console.log('finalJobsArr', finalJobsArr);
        if (finalJobsArr !== undefined)
            return finalJobsArr;

    }),
    getSecretMessage: protectedProcedure.query(() =>
    {
        return "you can now see this secret message!";
    }),
});
