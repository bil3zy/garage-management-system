import React from 'react';
import { DataTable } from './dataTable';
import { columns } from './columns';
import { api } from '~/utils/api';

export default function JobsPage()
{
    const { data } = api.jobs.findAll.useQuery();
    console.log(data);
    return (
        <div className="container mx-auto py-10">

            <DataTable
                columns={ columns }
                data={ data ?? [] } />

        </div>
    );
}
