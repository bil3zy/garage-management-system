/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "~/server/api/root";
import { RouterOutputs, api } from "~/utils/api";

import { FiPrinter } from "react-icons/fi";
import { FiMoreHorizontal } from "react-icons/fi";
import { z } from "zod";
import { Items } from "@prisma/client";
import { DataTableColumnHeader } from "../DataTableColumnHeader";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { ArrowDownSquare, ArrowUpSquare } from "lucide-react";
import { Button } from "../ui/button";

type NoUndefinedField<T> = { [P in keyof T]-?: NoUndefinedField<NonNullable<T[P]>> };
type RequiredProperty<T> = { [P in keyof T]: Required<NonNullable<T[P]>>; };
type RequiredNonNullableObject<T extends object> = { [P in keyof Required<T>]: NonNullable<T[P]>; };

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Jobs = RouterOutputs["jobs"]["findAll"];

// export type Columns = ColumnDef<any, any>[];

// export type Columns = ColumnDef<{
//     id: string;
//     firstName: string;
//     lastName: string;
//     phone: string;
//     registrationNumber: string;
//     costOfWork: number;
//     createdAt: Date;
//     vehicleId: string;
//     clientId: string;
//     subRows: {
//         items: {
//             id: string;
//             name: string | null;
//             broughtBy: string | null;
//             price: number | null;
//             createdAt: Date;
//             updatedAt: Date;
//             jobId: string | null;
//         }[];
//         mechanicId: string;
//     };
// }, any>[];

export const columns: ColumnDef<any, any>[] = [
    {
        id: 'arrowDown',
        // accessorFn: () => null,
        cell: ({ cell, row }) =>
        {

            return (
                <>
                    { row.getIsExpanded() ? (<ArrowUpSquare
                        onClick={ row.getToggleExpandedHandler() }
                        size={ 20 } />) : (

                        <ArrowDownSquare
                            onClick={ row.getToggleExpandedHandler() }
                            size={ 20 } />
                    )
                    }
                </>
            );
        }
    },
    {
        id: 'createdAt',
        cell: ({ cell }) =>
        {
            const date = new Date(cell.getValue() as Date);

            return date.toLocaleDateString("ar-EG", {
                day: "numeric",
                month: "short",
                year: "numeric",
            });
        },
        accessorFn: (row) => row.createdAt,
        header: ({ column }) => (
            <DataTableColumnHeader column={ column } title="تاريخ الانشاء" />
        ),
    },

    {
        accessorFn: (row) => `${row.firstName} ${row.lastName}`,
        header: "الاسم ",
    },

    {
        accessorFn: (row) => row.phone,
        id: 'phone',
        header: ({ column }) => (
            <DataTableColumnHeader column={ column } title="رقم الهاتف" />
        ),
    },
    {
        accessorFn: (row) => row.registrationNumber,
        id: 'registrationNumber',
        header: ({ column }) => (
            <DataTableColumnHeader column={ column } title="رقم اللوحة" />
        ),
    },
    {
        accessorFn: (row) => row.status,
        id: 'status',
        header: ({ column }) => (
            <DataTableColumnHeader column={ column } title="الحالة" />
        ),
        cell: ({ cell }) =>
        {
            return (
                <div className={ `p-2 rounded ${cell.getValue() === "انتهت" ? "bg-yellow-500" : "bg-green-600"} text-zinc-50  ` }>{ cell.getValue() }</div>
            );
        }
    },

    {
        accessorFn: row => row.costOfWork,
        id: 'costOfWork',
        header: ({ column }) => (
            <DataTableColumnHeader column={ column } title="القيمة النهائية" />
        ),
        cell: ({ cell }) =>
        {
            let taskPrice = Number(cell.getValue());
            cell.row.original.subRows.items.forEach((item: { price: any; }) =>
            {
                taskPrice += Number(item.price) ?? 0;
            });
            return taskPrice;
        }
    },
    {
        id: 'actions',
        // accessorFn: () => null,
        cell: ({ row }) =>
        {
            const updateVehicleMutation = api.vehicle.update.useMutation();
            const updateClientMutation = api.client.update.useMutation();
            const handleUpdateClientAndVehicle = async () =>
            {
                await updateVehicleMutation.mutateAsync({
                    id: row.original.vehicleId,
                    registrationNumber: row.original.registrationNumber,

                });
                await updateClientMutation.mutateAsync({
                    id: row.original.clientId,
                    firstName: row.original.firstName,
                    lastName: row.original.lastName,
                    phone: row.original.phone,
                });
                row.toggleSelected();
            };
            const completeJobMutation = api.jobs.completed.useMutation();
            const handleCompleteJob = async () =>
            {
                await completeJobMutation.mutateAsync({
                    id: row.original.id,
                    status: row.original.status,
                });
            };
            return (
                <>
                    {
                        row.getIsSelected() ? (
                            <Button onClick={ () => handleUpdateClientAndVehicle() }>حفظ التعديلات</Button>
                        ) : (

                            <div className="flex gap-2">
                                <FiPrinter
                                    className="cursor-pointer  "
                                    size={ 16 }
                                />
                                <DropdownMenu>
                                    <DropdownMenuTrigger>

                                        <FiMoreHorizontal
                                            onClick={ () => console.log('clicked') }
                                            className="cursor-pointer  "
                                            size={ 16 }
                                        />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>

                                        <DropdownMenuItem onClick={ (value) => row.toggleSelected(!!value) }>التعديل</DropdownMenuItem>
                                        <DropdownMenuItem onClick={ () => handleCompleteJob() }>اكتملت الصيانة</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        )
                    }
                </>
            );
        }
    }
];
