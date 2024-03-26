/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */

"use client";

import
{
    ColumnDef,
    ColumnFiltersState,
    RowData,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";

import
{
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "~/components/ui/table";
import React, { Fragment, useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { Toaster, toast } from "sonner";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import AddItemsForm from "./AddItemsForm";
import { Row } from "@tanstack/react-table";
import { Items } from "./subComponentColumns";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Label } from "../ui/label";
import { api } from "~/utils/api";
import { DataTablePagination } from "../DataTablePagination";


declare module '@tanstack/react-table' {
    interface TableMeta<TData extends RowData>
    {
        updateData: (rowIndex: number, columnId: string, value: unknown) => void;
    }
}


interface DataTableProps<TData, TValue>
{
    columns: ColumnDef<TData, TValue>[];
    // data: TData[];
    jobId: string;
    job: any;
}

const FormSchema = z.object({
    task: z
        .string(),
    costOfWork: z.number()

});


export function SubComponent<TData extends Items, TValue>({
    columns,
    // data,
    jobId,
    job
}: DataTableProps<TData, TValue>,
)
{
    const [open, setOpen] = React.useState(false);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    );
    const [rowSelection, setRowSelection] = React.useState({});
    // const [expanded, setExpanded] = React.useState<ExpandedState>({});

    const [dataState, setDataState] = useState<TData[] | null>(null);

    const [editTask, setEditTask] = useState(false);

    const { data } = api.items.findByJobId.useQuery({
        jobId: jobId ?? ""
    });

    console.log('subData', data);
    console.log('jobId', jobId);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        mode: 'onSubmit',
        defaultValues: {
            task: job.task,
            costOfWork: job.costOfWork
        }
    });

    const updateTaskMutation = api.jobs.updateTask.useMutation();

    async function onSubmit(data: z.infer<typeof FormSchema>)
    {
        await updateTaskMutation.mutateAsync({
            id: jobId,
            task: data.task,
            costOfWork: data.costOfWork
        });
        setEditTask(!editTask);
    }


    useEffect(() =>
    {
        setDataState(data as unknown as TData[]);
    }, [data]);

    // console.log('data', data);
    const DefaultColumn: Partial<ColumnDef<TData>> = {
        cell: ({ getValue, cell, row: { index }, row, column: { id }, table }) =>
        {
            const initialValue = getValue();
            // We need to keep and update the state of the cell normally
            const [value, setValue] = React.useState(initialValue);

            // When the input is blurred, we'll call our table meta's updateData function
            const onBlur = () =>
            {
                table.options.meta?.updateData(index, id, value);
            };

            // If the initialValue is changed external, sync it up with our state
            React.useEffect(() =>
            {
                setValue(initialValue);
            }, [initialValue]);

            return (

                cell.column.id === "broughtBy" && row.getIsSelected() ? (
                    <Select onValueChange={ value => setValue(value) } value={ value as string }>
                        <SelectTrigger onBlur={ onBlur } >
                            <SelectValue placeholder={ String(getValue()) } />
                        </SelectTrigger>
                        <SelectContent >
                            <SelectItem value="الورشة">الورشة</SelectItem>
                            <SelectItem value="العميل">العميل</SelectItem>
                        </SelectContent>
                    </Select>
                ) : row.getIsSelected() ? (
                    <Input
                        className={ `text-center w-full h-full  justify-center p-1  rounded-md text-muted-foreground` }
                        value={ value as string }
                        onChange={ e => setValue(e.target.value) }
                        onBlur={ onBlur }
                    />
                ) : getValue()
            );
        },
    };

    const updateItemsMutation = api.items.update.useMutation({});
    const handleUpdateChanges = async (rowData: Row<TData[number]>[]) =>
    {
        for (const row of rowData)
        {
            try
            {
                await updateItemsMutation.mutateAsync({
                    id: String(row.original.id),
                    name: String(row.original.name),
                    price: Number(row.original.price),
                    broughtBy: String(row.original.broughtBy),
                }).then(async () =>
                {

                    toast.success('تم تسجيل التغييرات ');
                    table.toggleAllRowsSelected(false);
                    // await utils.jobs.findAll.refetch();
                    await utils.items.findByJobId.refetch();

                });
            } catch (error)
            {
                toast.error("لقد حدث خطأ ما");
            }
        }

    };


    const defaultData = React.useMemo(() => [], []);
    const table = useReactTable({
        data: dataState ? dataState : defaultData,
        columns,
        defaultColumn: DefaultColumn,
        autoResetPageIndex: false,
        // debugRows: true,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: data?.length !== undefined && data.length > 0 ? getPaginationRowModel() : undefined,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnFiltersChange: setColumnFilters,
        onRowSelectionChange: setRowSelection,
        state: {
            columnFilters,
            rowSelection,
        },
        // Provide our updateData function to our table meta
        meta: {
            updateData: (rowIndex, columnId, value) =>
            {
                // Skip page index reset until after next rerender
                // skipAutoResetPageIndex();
                setDataState(old =>
                    old!.map((row, index) =>
                    {
                        if (index === rowIndex)
                        {
                            return {
                                ...old![rowIndex]!,
                                [columnId]: value,
                            };
                        }
                        return row;
                    })
                );
            },
        },
    });


    const rowData: any = table.getSelectedRowModel().flatRows;

    const utils = api.useUtils();
    const mechanics = api.mechanic.findAll.useQuery();
    const updateMechanicMutation = api.jobs.updateMechanic.useMutation();

    const handleUpdateMechanic = async (jobId: string, mechanicId: string) =>
    {
        try
        {
            await updateMechanicMutation.mutateAsync({
                id: String(jobId),
                mechanicId: mechanicId,
            });
            await utils.mechanic.invalidate();
            toast.success('تم تغيير الفني');
        } catch (error)
        {
            toast.error('لقد حدث خطأ ما');
        }
    };

    return (
        <>
            <div className="m-8 gap-8 flex flex-col" >
                <Toaster />
                <div className="flex justify-between  mb-8">
                    {/* <div className="flex w-full justify-start gap-16">
                    <SearchBar table={ table } />
           
                </div> */}



                    <div className="w-full gap-6 grid grid-cols-2">
                        <div className="grid w-96 ">
                            <Form { ...form }>
                                <form className="gap-8 grid">
                                    <FormField
                                        control={ form.control }
                                        name="costOfWork"
                                        render={ ({ field }) => (
                                            <FormItem onChange={ (e) => form.setValue("costOfWork", Number((e.target as HTMLButtonElement).value)) }>
                                                <FormLabel>قيمة شغل اليد</FormLabel>
                                                <FormControl>
                                                    <Input inputMode="numeric" disabled={ !editTask } defaultValue={ (job?.costOfWork) }  { ...field } />
                                                </FormControl>
                                            </FormItem>
                                        ) }
                                    />
                                    <FormField
                                        control={ form.control }
                                        name="task"
                                        render={ ({ field }) => (
                                            <FormItem className="w-full">
                                                <FormControl>

                                                    <Textarea disabled={ !editTask } defaultValue={ String(job?.task) ?? "" } placeholder="أعمال الصيانة المطلوبة"   { ...field }
                                                    />
                                                </FormControl>




                                            </FormItem>
                                        ) } />
                                    <div className="w-full">

                                        { !editTask ? (

                                            <Button className="" type="button" onClick={ () => setEditTask(!editTask) }>تعديل</Button>
                                        ) : (


                                            <Button className="" type="button" onClick={ form.handleSubmit(onSubmit) }>احفظ</Button>
                                        )
                                        }
                                    </div>
                                </form>
                            </Form>
                        </div>
                        <div className="flex flex-col gap-4">

                            <Label className="text-right ">الفني</Label>
                            <Select onValueChange={ (value => handleUpdateMechanic(jobId, value)) }  >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder={ job.subRows.mechanic.name ? job.subRows.mechanic.name : "الفني" } />
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        mechanics.data?.map((mechanic) =>
                                        {
                                            // console.log(mechanic);
                                            return (
                                                <SelectItem key={ mechanic.id } value={ mechanic.id }>{ mechanic.name }</SelectItem>
                                            );
                                        })
                                    }
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
                <div className="border rounded-md ">
                    <Table className={ `m-auto w-full relative h-full bg-transparent text-center shadow-lg` }>
                        <TableHeader className=" rounded-lg h-12" >
                            { table.getHeaderGroups().map((headerGroup) => (
                                <TableRow className="text-center   h-12" key={ headerGroup.id }>
                                    { headerGroup.headers.map((header) =>
                                    {
                                        return (
                                            <TableHead className="text-center  h-12 m-auto p-0" key={ header.id }>
                                                { header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    ) }
                                            </TableHead>
                                        );
                                    }) }
                                </TableRow>
                            )) }
                        </TableHeader>
                        <TableBody>
                            { table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) =>
                                {
                                    return (
                                        <Fragment key={ row.id }>
                                            <TableRow  >
                                                {/* first row is a normal row */ }
                                                { row.getVisibleCells().map(cell =>
                                                {
                                                    return (
                                                        <TableCell className="w-32" key={ cell.id }>
                                                            { flexRender(
                                                                cell.column.columnDef.cell,
                                                                cell.getContext()
                                                            ) }
                                                        </TableCell>
                                                    );
                                                }) }
                                            </TableRow>

                                        </Fragment>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={ columns.length } className="h-24 text-center m-auto ">
                                        لم نجد أي نتائج.
                                    </TableCell>
                                </TableRow>
                            ) }
                        </TableBody>
                    </Table >

                    {
                        data?.length !== undefined && data?.length > 10 && (

                            <DataTablePagination table={ table } />
                        )
                    }

                    {/* <DataTablePagination table={ table } /> */ }
                </div >
                {
                    table.getSelectedRowModel().flatRows.length > 0 ? (
                        <div className="flex justify-center">
                            <Button type="button" onClick={ () => handleUpdateChanges(rowData) }>حفظ جميع التغييرات</Button>
                        </div>
                    ) : (



                        <div className="flex gap-6 w-full justify-center">

                            <Dialog open={ open } onOpenChange={ setOpen } >

                                <DialogTrigger asChild>
                                    <Button type="button">
                                        إضافة قطعة
                                    </Button>


                                </DialogTrigger>
                                <DialogContent className="bg-zinc-50 w-4/12 px-16 py-8">
                                    <AddItemsForm setOpen={ setOpen } jobId={ jobId } />
                                </DialogContent>
                            </Dialog>

                        </div>

                    )
                }
            </div >
        </>
    );
}

