import { useRouter } from 'next/router';
import React from 'react';

export default function Header()
{
    const router = useRouter();
    console.log(router);
    return (
        <div className=" bg-white h-14  top-0 flex gap-24  p-4 drop-shadow-md w-full ">
            <h3>ورشتي</h3>
            <h5>
                {/* {router.back} */ }
            </h5>
        </div>
    );
}
