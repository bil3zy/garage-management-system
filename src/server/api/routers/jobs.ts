import { PrismaClient } from "@prisma/client";
import { ClientModel, JobsModel, VehicleModel } from "prisma/zod";
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
            createdAt: Date;
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
                    createdAt: job.createdAt,
                    subRows: {
                        items: job.items,
                        workers: job.worker ?? ""
                    },
                };
                finalJobsArr.push(jobObject);
            });

        });
        console.log('finalJobsArr', finalJobsArr);
        const sortedJobsArr = finalJobsArr.sort((a, b) => b.createdAt.getUTCDate() - a.createdAt.getUTCDate());
        if (finalJobsArr !== undefined)
            return sortedJobsArr;

    }),
    create: protectedProcedure
        .input(z.object({
            client: z.object({
                firstName: z.string().min(0).max(25),
                lastName: z.string().min(0).max(25),
                phone: z.string().min(0).max(10, "الرقم يجب أن لا يتجاوز العشرةأرقام"),
                address: z.string().min(0).max(50),
            }),
            vehicle: z.object({
                registrationNumber: z.string().min(2).max(50),
                yearOfManufacture: z.number().gt(1900).lte(new Date().getFullYear()),
                model: z.string().min(2).max(50),
            }),
            job: z.object({
                mechanic: z.string(),
                task: z.string()
            }),

        }))
        .mutation(async ({ ctx, input }) =>
        {
            const findClient = await ctx.db.client.findFirst({
                where:
                {
                    phone: input.client.phone
                }
            });
            const foundVehicle = await ctx.db.vehicle.findFirst({
                where:
                {
                    registrationNumber: input.vehicle.registrationNumber
                }
            });

            console.log('foundVehicle', foundVehicle);
            console.log('findClient', findClient);

            const createdJob = await ctx.db.jobs.create({
                data: {
                    client: {
                        create: {
                            address: input.client.address,
                            firstName: input.client.firstName,
                            lastName: input.client.lastName,
                            phone: input.client.phone,

                        },
                    },
                    vehicle: {
                        create: {
                            registrationNumber: input.vehicle.registrationNumber,
                            model: input.vehicle.model,
                            yearOfManufacture: input.vehicle.yearOfManufacture,
                        }
                    },
                    status: "جاري",
                    task: input.job.task ?? "",
                    worker: input.job.mechanic ?? "",
                }
            });

            return createdJob;
        }),
    getSecretMessage: protectedProcedure.query(() =>
    {
        return "you can now see this secret message!";
    }),
});
