import { useRouter } from 'next/router';
import React from 'react';
import { Button } from './ui/button';
import { MdArrowBackIosNew } from "react-icons/md";
export default function Header({ prevPath, currentPath }: {
    prevPath: { arabicName: string, path: string; };
    currentPath: { arabicName: string, path: string; };
})
{
    const router = useRouter();
    return (
        <div className=" bg-white h-16 fixed  items-center  top-0 flex gap-24 z-50 p-4 drop-shadow-md w-screen ">
            <Button className='hover:no-underline text-2xl' variant={ 'link' } onClick={ () => router.push('/') }>ورشتي</Button>
            {
                prevPath && currentPath && (

                    <div className='flex  justify-center h-full items-center '>
                        <Button variant={ 'link' } onClick={ () => router.push('/') }>
                            { prevPath?.arabicName }
                        </Button>
                        <MdArrowBackIosNew size={ 14 } className='text-center mt-1' />
                        <Button variant={ 'link' } onClick={ () => router.push(`/${currentPath.path}`) }>
                            { currentPath?.arabicName }
                        </Button>
                    </div>
                )
            }
        </div>
    );
}
