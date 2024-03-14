import { Input } from '~/components/ui/input';
import { Table } from '@tanstack/react-table';
import React from 'react';

export default function SearchBar<TData>({ table }: { table: Table<TData>; })
{
    return (
        <div className="flex items-center w-1/4 min-w-[140px] ">
            <Input
                placeholder="ابحث"
                value={ (table.getColumn("lastName")?.getFilterValue() as string) ?? "" }
                onChange={ (event) =>
                {
                    table.getColumn("lastName")?.setFilterValue(event.target.value);
                }
                }
                className="max-w-sm"
            />
        </div>
    );
}
