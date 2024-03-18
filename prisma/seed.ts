/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Client } from "@prisma/client";
import { db } from "~/server/db";


const main = async () =>
{
    await db.client.deleteMany();
    await db.vehicle.deleteMany();
    await db.jobs.deleteMany();
    await db.items.deleteMany();
    await db.mechanic.deleteMany();

    for (let index = 0; index < 20; index++)
    {
        await db.client.create({
            data: {
                firstName: `${index}-أحمد`,
                lastName: `${index}-حسين`,
                phone: `0123456789`,
                address: `طرابلس`,

            }
        }).then(async (clientRes) =>
        {
            const createVehicle = await db.vehicle.create({
                data: {
                    model: `model-${index}`,
                    yearOfManufacture: 2020,
                    registrationNumber: `13-${3252342332 + index}`,
                    client: {
                        connect: {
                            id: clientRes.id
                        }
                    }
                }
            }).then(async (vehicleRes) =>
            {

                const createdJobs = await db.jobs.create({
                    data: {
                        task: `صيانة ${index}`,
                        costOfWork: (Math.floor(Math.random() * 1000)),
                        items: {
                            create: {
                                name: `القطعة ${index}`,
                                broughtBy: `${(Math.floor(Math.random() * 2)) % 2 === 0 ? `العميل` : `الورشة`}`,
                                price: (Math.floor(Math.random() * 200)),
                            },
                        },
                        client: {
                            connect: {
                                id: clientRes.id
                            }
                        },
                        vehicle: {
                            connect: {
                                id: vehicleRes.id
                            }
                        },
                        mechanic: {
                            create: {
                                name: `عبد السميع ${index}`,
                                percentage: (Math.floor(Math.random() * 100)),
                            }
                        },

                    }
                });
            });
        });
    }
};

main()
    .then(async () =>
    {
        await db.$disconnect();
    })
    .catch(async (e) =>
    {
        console.error(e);
        await db.$disconnect();
        process.exit(1);
    });