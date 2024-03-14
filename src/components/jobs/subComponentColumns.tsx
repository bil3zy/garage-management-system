"use client";

import { ColumnDef } from "@tanstack/react-table";
import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "~/server/api/root";
import { RouterOutputs } from "~/utils/api";
import { Checkbox } from "../ui/checkbox";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Items = {
    id: string;
    name: string | null;
    broughtBy: string | null;
    price: string | null;
    createdAt: Date;
    updatedAt: Date;
    jobId: string | null;
}[];

export const subComponentColumns: ColumnDef<Items>[] = [
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

        accessorFn: (row, id) => row.name,
        header: "القطعة",
    },
    {
        accessorFn: (row) => row.price,
        header: 'السعر'
    },
    {
        accessorFn: (row) => row.broughtBy,
        header: 'مدفوعة من'
    }

]

