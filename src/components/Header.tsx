import { useRouter } from 'next/router';
import React from 'react';
import { Button } from './ui/button';
import { MdArrowBackIosNew } from "react-icons/md";
import { FiChevronsLeft, FiMenu } from 'react-icons/fi';

export default function Header({ prevPath, currentPath, setSideMenuOpen, sideMenuOpen }: {
    prevPath?: { arabicName: string, path: string; };
    currentPath?: { arabicName: string, path: string; };
    setSideMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
    sideMenuOpen: boolean;
})
{
    const router = useRouter();
    return (
        <div className=" bg-white h-16 fixed  items-center  top-0 flex gap-8 z-50 p-4 drop-shadow-md w-screen ">
            <FiMenu className='mt-2' onClick={ () => setSideMenuOpen(!sideMenuOpen) } />
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
