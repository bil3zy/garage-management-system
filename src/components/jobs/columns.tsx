/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "~/server/api/root";
import { RouterOutputs } from "~/utils/api";

import { FiPrinter } from "react-icons/fi";
import { FiMoreHorizontal } from "react-icons/fi";
import { z } from "zod";
import { Items } from "@prisma/client";
import { DataTableColumnHeader } from "../DataTableColumnHeader";

type NoUndefinedField<T> = { [P in keyof T]-?: NoUndefinedField<NonNullable<T[P]>> };
type RequiredProperty<T> = { [P in keyof T]: Required<NonNullable<T[P]>>; };
type RequiredNonNullableObject<T extends object> = { [P in keyof Required<T>]: NonNullable<T[P]>; };

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Jobs = RouterOutputs["jobs"]["findAll"];

export const columns: ColumnDef<{
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    registrationNumber: string;
    costOfWork: number;
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
    };
}>[] = [
        // {
        //     id: 'expander',
        //     header: () => null,
        //     cell: ({ row }) =>
        //     {
        //         return row.getCanExpand() ? (
        //             <button
        //                 { ...{
        //                     onClick: row.getToggleExpandedHandler(),
        //                     style: { cursor: 'pointer' },
        //                 } }
        //             >
        //                 { row.getIsExpanded() ? '👇' : '👉' }
        //             </button>
        //         ) : (
        //             '🔵'
        //         );
        //     },
        // },

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
            accessorFn: row => row.costOfWork,
            id: 'costOfWork',

            header: ({ column }) => (
                <DataTableColumnHeader column={ column } title="القيمة النهائية" />
            ),
            cell: ({ cell }) =>
            {
                let taskPrice = Number(cell.getValue());
                cell.row.original.subRows.items.forEach((item) =>
                {
                    taskPrice += Number(item.price) ?? 0;
                });
                return taskPrice;
                console.log('cell', cell);
            }
        },
        {
            id: 'actions',
            cell: ({ row }) =>
            {
                return (
                    <div className="gap-4 flex">
                        <FiPrinter
                            className="cursor-pointer h-10/12 w-10/12 m-1.5"
                        />
                        <FiMoreHorizontal
                            onClick={ () => console.log('clicked') }
                            className="cursor-pointer  h-10/12 w-10/12 m-1.5"
                        />
                    </div>
                );
            }
        }
    ];
