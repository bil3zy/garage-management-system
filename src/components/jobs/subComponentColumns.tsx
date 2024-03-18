/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
"use client";

import { ColumnDef, RowData } from "@tanstack/react-table";
import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "~/server/api/root";
import { RouterOutputs } from "~/utils/api";
import { Checkbox } from "../ui/checkbox";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Items = {
    id: string;
    name: string;
    broughtBy: string;
    price: number;
    createdAt: Date;
    updatedAt: Date;
    jobId: string;
}[];

export const subComponentColumns: ColumnDef<any, any>[] = [
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
        id: "select",
        // header: ({ table }) => (
        //     <Checkbox
        //         checked={
        //             table.getIsAllPageRowsSelected() ||
        //             (table.getIsSomePageRowsSelected() && "indeterminate")
        //         }
        //         onCheckedChange={ (value) => table.toggleAllPageRowsSelected(!!value) }
        //         aria-label="Select all"
        //     />
        // ),
        cell: ({ row }) => (

            <Checkbox
                checked={ row.getIsSelected() }
                onCheckedChange={ (value) => row.toggleSelected(!!value) }
                aria-label="Select row"
            />

        ),
    },
    {

        accessorFn: (row) => row.name,
        id: 'name',
        header: "القطعة",
    },
    {
        accessorFn: (row) => row.price,
        id: 'price',
        header: 'السعر'
    },
    {
        accessorFn: (row) => row.broughtBy,
        id: 'broughtBy',
        header: 'مدفوعة من'
    }

]

