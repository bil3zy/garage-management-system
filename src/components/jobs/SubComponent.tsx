/* eslint-disable react-hooks/rules-of-hooks */
// import React from 'react';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
// import { Button } from '../ui/button';

// export default function SubComponent({ row })
// {
//     console.log('row from sub', row);
//     return (
//         <div className='grid grid-cols-2'>
//             <div>

//                 <Table className='m-8 w-fit'>
//                     <TableHeader>
//                         <TableRow>
//                             <TableHead className='text-center'>القطعة</TableHead>
//                             <TableHead className='text-center'>السعر</TableHead>
//                             <TableHead className='text-center'>إحضار</TableHead>
//                         </TableRow>
//                     </TableHeader>

//                     <TableBody>
//                         { row.original.subRows.items.map((item) =>
//                         {
//                             return (


//                                 <TableRow key={ row.id }>
//                                     <TableCell className='text-sm'>
//                                         { item.name }
//                                     </TableCell>


//                                     <TableCell>
//                                         { item.price }
//                                     </TableCell>

//                                     <TableCell>
//                                         { ` ${item.broughtBy}` }
//                                     </TableCell>
//                                 </TableRow>
//                             );
//                         }
//                         )
//                         }
//                     </TableBody>
//                 </Table>
//                 <Button variant={ 'default' }>إضافة قطعة</Button>
//             </div>

//         </div>
//     );
// }
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
// import TeacherChangeForm from "../TeacherChangeForm/TeacherChangeForm";
import { Toaster } from "sonner";
// import DeleteManyTeachers from "../DeleteManyTeachers";
// import { Teacher } from "@prisma/client";
import { DataTablePagination } from "~/components/DataTablePagination";
import SearchBar from "~/components/SearchBar";
import { getExpandedRowModel } from "@tanstack/react-table";
import { ExpandedState } from "@tanstack/react-table";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";

// import SubComponent from "./SubComponent";
// import { Student } from "@prisma/client";
// import StudentChangeForm from "./StudentChangeForm";
// import SelectClass from "./SelectClass";
// import DeleteManyStudents from "./DeleteManyStudents";
// import StudentChangeForm from "./StudentChangeForm";
// import TeacherChangeForm from "~/components/TeacherChangeForm/TeacherChangeForm";

declare module '@tanstack/react-table' {
    interface TableMeta<TData extends RowData>
    {
        updateData: (rowIndex: number, columnId: string, value: unknown) => void;
    }
}


interface DataTableProps<TData, TValue>
{
    columns: ColumnDef<TData, TValue>[];
    data: TData[];

}


export function SubComponent<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>)
{
    const [open, setOpen] = React.useState(false);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    );
    const [rowSelection, setRowSelection] = React.useState({});
    // const [expanded, setExpanded] = React.useState<ExpandedState>({});

    const [dataState, setDataState] = useState<TData[] | null>(null);
    // const [isOpen, setIsOpen] = React.useState(false);

    useEffect(() =>
    {
        setDataState(data);
    }, [data]);

    console.log('data', data);
    const DefaultColumn: Partial<ColumnDef<TData>> = {
        cell: ({ getValue, row: { index }, row, column: { id }, table }) =>
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
                row.getIsSelected() ? (

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

    const defaultData = React.useMemo(() => [], []);
    const table = useReactTable({
        data: dataState ? dataState : defaultData,
        columns,
        defaultColumn: DefaultColumn,
        autoResetPageIndex: false,
        // debugRows: true,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnFiltersChange: setColumnFilters,
        onRowSelectionChange: setRowSelection,
        // onExpandedChange: setExpanded,
        // getRowCanExpand: () => true,
        // getSubRows: row => row?.subRows,
        // getExpandedRowModel: getExpandedRowModel(),

        state: {
            columnFilters,
            rowSelection,
            // expanded,

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

    // console.log('row', rowSelection);
    // console.log('originalRow', table.getSelectedRowModel().rows[0].original);
    // console.log('expanded', expanded);

    return (
        <div className="m-8 gap-16" >
            <Toaster />
            <div className="flex justify-between  mb-8">
                {/* <div className="flex w-full justify-start gap-16">
                    <SearchBar table={ table } />
           
                </div>

                <div className="flex gap-6">

                    <Dialog open={ open } onOpenChange={ setOpen }>

                        <DialogTrigger asChild>
                            <Button>
                                إضافة
                            </Button>


                        </DialogTrigger>
                        <DialogContent>
                      
                        </DialogContent>
                    </Dialog>


                </div> */}

                <div className="w-full gap-6 grid">
                    <Select>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="العامل" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="worker">العامل</SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="grid w-96 gap-2">
                        <Textarea placeholder="أعمال الصيانة المطلوبة" />
                        <Button>سجل أعمال الصيانة</Button>
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


                {/* <DataTablePagination table={ table } /> */ }
            </div >
            <Button>إضافة قطعة</Button>
        </div >

    );
}

