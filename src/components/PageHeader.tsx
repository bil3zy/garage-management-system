import { useRouter } from 'next/router';
import React from 'react';

export default function PageHeader()
{
    const router = useRouter();
    console.log(router);
    return (
        <div className="  h-16 flex gap-24  px-20 py-4  w-full ">
            <h3 className=' text-3xl text-right'>ورشتي</h3>
            <h5>
                {/* {router.back} */ }
            </h5>
        </div>
    );
}
