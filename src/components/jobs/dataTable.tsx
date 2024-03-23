/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

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

import { DataTablePagination } from "~/components/DataTablePagination";
import SearchBar from "~/components/SearchBar";
import { getExpandedRowModel } from "@tanstack/react-table";
import { ExpandedState } from "@tanstack/react-table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { SubComponent } from "./SubComponent";
import { subComponentColumns } from "./subComponentColumns";
import { SortingState } from "@tanstack/react-table";
import { getSortedRowModel } from "@tanstack/react-table";
import { RouterOutputs } from "~/utils/api";
import { Input } from "../ui/input";
import { useRouter } from "next/router";

declare module '@tanstack/react-table' {
    interface TableMeta<TData extends RowData>
    {
        updateData: (rowIndex: number, columnId: string, value: unknown) => void;
    }
}

interface DataTableProps<TData, TValue>
{
    columns: any;
    data: TData[];

}




export function DataTable<TData extends NonNullable<RouterOutputs["jobs"]["findAll"]>[number], TValue>({
    columns,
    data,


}: DataTableProps<TData, TValue>)
{
    const [open, setOpen] = React.useState(false);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    );
    const [rowSelection, setRowSelection] = React.useState({});
    const [expanded, setExpanded] = React.useState<ExpandedState>({});

    const [dataState, setDataState] = useState<TData[] | null>(null);
    const [isOpen, setIsOpen] = React.useState(false);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [updatedRow, setUpdatedRow] = useState<boolean>(false);


    useEffect(() =>
    {
        setDataState(data);
    }, [data]);


    const defaultColumn: Partial<ColumnDef<TData>> = {
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
                        className={ `text-center  rounded-md text-muted-foreground` }
                        value={ value as string }
                        onChange={ e => setValue(e.target.value) }
                        onBlur={ onBlur }
                    />
                ) : getValue()
            );
        },
    };

    const router = useRouter();

    const defaultData = React.useMemo(() => [], []);
    const table = useReactTable({
        data: dataState ? dataState : defaultData,
        columns,
        defaultColumn,
        autoResetPageIndex: false,
        // debugRows: true,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnFiltersChange: setColumnFilters,
        onRowSelectionChange: setRowSelection,
        onExpandedChange: setExpanded,
        getRowCanExpand: () => true,
        // getSubRows: row => row?.subRows,
        getExpandedRowModel: getExpandedRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        state: {
            columnFilters,
            rowSelection,
            expanded,
            sorting,

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

    return (
        <div className="m-8" >
            <Toaster />
            <div className="flex justify-between py-4">
                <div className="flex w-full justify-start gap-16">
                    <SearchBar table={ table } />
                    {/* <SelectClass allClassesIsFetched={ allClassesIsFetched } classId={ classId } setClassId={ setClassId } /> */ }
                </div>

                <div className="flex gap-6">

                    {/* <DeleteManyStudents table={ table } /> */ }
                    {/* <Dialog open={ open } onOpenChange={ setOpen }> */ }

                    {/* <DialogTrigger asChild> */ }
                    <Button onClick={ () => router.push('/new-client') }>
                        إضافة
                    </Button>


                    {/* </DialogTrigger> */ }
                    {/* <DialogContent> */ }

                    {/* </DialogContent> */ }
                    {/* </Dialog> */ }


                </div>
            </div>
            <div className="border rounded-md m-8">
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
                                        <TableRow className={ `w-fit ${row.getIsExpanded() ? 'bg-slate-100' : ''} cursor-pointer` }>
                                            {/* first row is a normal row */ }
                                            { row.getVisibleCells().map(cell =>
                                            {
                                                // console.log('cell', cell.column.id);

                                                return (
                                                    <TableCell className={ `w-fit ${cell.column.id === 'arrowDown' || cell.column.id === 'actions' && 'w-fit p-2'
                                                        } ` } key={ cell.id }>
                                                        { flexRender(
                                                            cell.column.columnDef.cell,
                                                            cell.getContext()
                                                        ) }
                                                    </TableCell>
                                                );
                                            }) }
                                        </TableRow>
                                        { row.getIsExpanded() && (
                                            <TableRow>
                                                {/* 2nd row is a custom 1 cell row */ }
                                                <TableCell colSpan={ row.getVisibleCells().length }>
                                                    <SubComponent job={ row.original } jobId={ row.original?.id } data={ (row.original as any).subRows.items as any } columns={ subComponentColumns } />
                                                </TableCell>
                                            </TableRow>
                                        ) }
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

                <DataTablePagination table={ table } />
            </div >
        </div >

    );
};;
