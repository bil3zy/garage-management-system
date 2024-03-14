/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Client } from "@prisma/client";
import { db } from "~/server/db";


const main = async () =>
{
    await db.client.deleteMany();
    await db.vehicle.deleteMany();
    await db.jobs.deleteMany();

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
                        worker: `عبد السميع ${index}`,
                        task: `صيانة ${index}`,
                        price: String(Math.floor(Math.random() * 1000) + "د.ل"),
                        items: {
                            create: {
                                name: `القطعة ${index}`,
                                broughtBy: `${(Math.floor(Math.random() * 2)) % 2 === 0 ? `العميل` : `الورشة`}`,
                                price: String(Math.floor(Math.random() * 200) + 'د.ل'),
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
                        }
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