import
{
    ChevronLeftIcon,
    ChevronRightIcon,
    DoubleArrowLeftIcon,
    DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import
{
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select";
import { Button } from "~/components/ui/button";

interface DataTablePaginationProps<TData>
{
    table: Table<TData>;
}

export function DataTablePagination<TData>({
    table,
}: DataTablePaginationProps<TData>)
{
    return (

        <div className="flex m-8 items-center justify-between px-2">
            <div className="flex-1 text-sm text-muted-foreground">
                { table.getFilteredSelectedRowModel().rows.length } من{ " " }
                { table.getFilteredRowModel().rows.length } ًصفاً مختارا
            </div>
            <div className="flex items-center space-x-6 lg:space-x-8">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">عدد الصفوف</p>
                    <Select
                        value={ `${table.getState().pagination.pageSize}` }
                        onValueChange={ (value: unknown) =>
                        {
                            table.setPageSize(Number(value));
                        } }
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={ table.getState().pagination.pageSize } />
                        </SelectTrigger>
                        <SelectContent side="top">
                            { [10, 20, 30, 40, 50].map((pageSize) => (
                                <SelectItem key={ pageSize } value={ `${pageSize}` }>
                                    { pageSize }
                                </SelectItem>
                            )) }
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                    الصفحة { table.getState().pagination.pageIndex + 1 } من{ " " }
                    { table.getPageCount() }
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        onClick={ () => table.setPageIndex(0) }
                        disabled={ !table.getCanPreviousPage() }
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                    >
                        <span className="sr-only">الصفحة الأخيرة</span>
                        <DoubleArrowRightIcon className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        onClick={ () => table.previousPage() }
                        disabled={ !table.getCanPreviousPage() }
                        className="h-8 w-8 p-0"
                    >
                        <span className="sr-only">الصفحة القادمة</span>
                        <ChevronRightIcon className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={ () => table.nextPage() }
                        disabled={ !table.getCanNextPage() }
                    >
                        <span className="sr-only">الصفحة السابقة</span>
                        <ChevronLeftIcon className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={ () => table.setPageIndex(table.getPageCount() - 1) }
                        disabled={ !table.getCanNextPage() }
                    >
                        <span className="sr-only">الصفحة الأولى</span>
                        <DoubleArrowLeftIcon className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
