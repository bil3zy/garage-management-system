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
            costOfWork: number;
            createdAt: Date;
            task: string;
            subRows: {
                items: {
                    id: string;
                    name: string | null;
                    broughtBy: string | null;
                    price: number | null;
                    createdAt: Date;
                    updatedAt: Date;
                    jobId: string | null;
                }[];
                mechanicId: string;
                mechanic: {
                    name: string,
                    percentage: number,
                };
            };
        }[] = [];

        const foundJobs = await ctx.db.jobs.findMany({
            include: {
                client: true,
                items: true,
                vehicle: true,
                mechanic: true,
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
                    costOfWork: Number(job.costOfWork),
                    createdAt: job.createdAt,
                    task: job.task ?? "",
                    vehicleId: job.vehicleId,
                    clientId: job.clientId,
                    subRows: {
                        items: job.items,
                        mechanicId: job.mechanicId ?? "",
                        mechanic: {
                            name: job.mechanic?.name ?? "",
                            percentage: job.mechanic?.percentage ?? 0
                        }
                    },
                };
                finalJobsArr.push(jobObject);
            });

        });
        console.log('finalJobsArr', finalJobsArr);
        const sortedJobsArr = finalJobsArr.sort((a, b) => b.createdAt.getUTCDate() - a.createdAt.getUTCDate());
        if (sortedJobsArr !== undefined)
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
                mechanicId: z.string(),
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
                    mechanicId: undefined,
                }
            });

            return createdJob;
        }),
    updateMechanic: protectedProcedure.input(z.object({
        id: z.string(),
        mechanicId: z.string(),
    })).mutation(async ({ ctx, input }) =>
    {
        const updatedJob = await ctx.db.jobs.update({
            where: {
                id: input.id
            },
            data: {
                mechanicId: input.mechanicId,
            }
        });
        return updatedJob;
    }),
    updateTask: protectedProcedure.input(z.object({
        id: z.string(),
        task: z.string(),
        costOfWork: z.number()

    })).mutation(async ({ ctx, input }) =>
    {
        const updatedJob = await ctx.db.jobs.update({
            where: {
                id: input.id
            },
            data: {
                task: input.task,
                costOfWork: input.costOfWork,
            }
        });
        return updatedJob;
    }),
    getSecretMessage: protectedProcedure.query(() =>
    {
        return "you can now see this secret message!";
    }),
});
