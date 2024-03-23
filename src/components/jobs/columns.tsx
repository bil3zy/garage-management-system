/* eslint-disable react-hooks/rules-of-hooks */
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
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

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

const formSchema = z.object({
    firstName: z.string().min(0).max(50).optional(),
    lastName: z.string().min(0).max(50).optional(),
    phone: z.string().min(0).max(10, "الرقم يجب أن لا يتجاوز العشرة أرقام").optional(),
    registrationNumber: z.string().min(0).max(50).optional(),
});

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
        cell: ({ row, table }) =>
        {

            // 1. Define your form.
            const form = useForm<z.infer<typeof formSchema>>({
                resolver: zodResolver(formSchema),

            });

            const utils = api.useUtils();
            // console.log(utils.jobs.);
            const updateVehicleMutation = api.vehicle.update.useMutation({
                onSuccess: async () => await utils.jobs.findAll.refetch()

            });
            const updateClientMutation = api.clients.update.useMutation({
                onSuccess: async () => await utils.jobs.findAll.refetch()

            });
            const handleUpdateClientAndVehicle = async () =>
            {
                await updateVehicleMutation.mutateAsync({
                    id: row.original.vehicleId,
                    registrationNumber: form.getValues("registrationNumber"),

                });
                await updateClientMutation.mutateAsync({
                    id: row.original.clientId,
                    firstName: form.getValues("firstName"),
                    lastName: form.getValues("lastName"),
                    phone: form.getValues("phone"),
                });
            };

            const completeJobMutation = api.jobs.completed.useMutation({
                onSuccess: async () => await utils.jobs.findAll.refetch()
            });
            const handleCompleteJob = async () =>
            {
                await completeJobMutation.mutateAsync({
                    id: row.original.id,
                    status: row.original.status,
                });
            };
            console.log(row);
            return (
                <>



                    <div className="flex gap-2">
                        <FiPrinter
                            className="cursor-pointer  "
                            size={ 16 }
                        />
                        <Dialog>

                            <DropdownMenu>
                                <DropdownMenuTrigger>

                                    <FiMoreHorizontal
                                        onClick={ () => console.log('clicked') }
                                        className="cursor-pointer  "
                                        size={ 16 }
                                    />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DialogTrigger asChild>

                                        <DropdownMenuItem >التعديل</DropdownMenuItem>
                                    </DialogTrigger>
                                    <DropdownMenuItem onClick={ () => handleCompleteJob() }>اكتملت الصيانة</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <DialogContent className="bg-zinc-50 flex justify-center items-center" dir='rtl'>
                                <Form { ...form }>
                                    <form className="space-y-8">
                                        <FormField
                                            control={ form.control }
                                            name="firstName"
                                            render={ ({ field }) => (
                                                <FormItem>
                                                    <FormLabel>الاسم الأول</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder={ row.original.firstName }  { ...field } />
                                                    </FormControl>

                                                    <FormMessage />
                                                </FormItem>
                                            ) }
                                        />

                                        <FormField
                                            control={ form.control }
                                            name="lastName"
                                            render={ ({ field }) => (
                                                <FormItem>
                                                    <FormLabel>الاسم الثاني</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder={ row.original.lastName }  { ...field } />
                                                    </FormControl>

                                                    <FormMessage />
                                                </FormItem>
                                            ) }
                                        />

                                        <FormField
                                            control={ form.control }
                                            name="phone"
                                            render={ ({ field }) => (
                                                <FormItem>
                                                    <FormLabel>رقم الهاتف</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder={ row.original.phone }   { ...field } />
                                                    </FormControl>
                                                    <FormDescription>
                                                        This is your public display name.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            ) }
                                        />
                                        <FormField
                                            control={ form.control }
                                            name="registrationNumber"
                                            render={ ({ field }) => (
                                                <FormItem>
                                                    <FormLabel>رقم المركبة</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder={ row.original.registrationNumber }  { ...field } />
                                                    </FormControl>

                                                    <FormMessage />
                                                </FormItem>
                                            ) }
                                        />
                                        <DialogClose asChild>

                                            <Button type="button" onClick={ async () => await handleUpdateClientAndVehicle() }>احفظ التعديلات</Button>
                                        </DialogClose>
                                    </form>
                                </Form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </>
            );
        }
    }
];
