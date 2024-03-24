import React, { ReactNode } from 'react';
import Header from './Header';
import PageHeader from './PageHeader';
import { Button } from './ui/button';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';


export default function Layout({ children, currentPath, prevPath }: {
    children: ReactNode;
    currentPath?: { arabicName: string, path: string; };
    prevPath?: { arabicName: string, path: string; };
})
{

    const [sideMenuOpen, setSideMenuOpen] = React.useState(false);
    const router = useRouter();
    return (
        <>
            { currentPath?.arabicName && (
                <Head>
                    <title> { currentPath?.arabicName } </title>
                </Head>)
            }
            <div className="w-screen h-full pb-8 flex flex-col items-end relative ">

                <Header currentPath={ currentPath } prevPath={ prevPath } sideMenuOpen={ sideMenuOpen } setSideMenuOpen={ setSideMenuOpen } />



                { sideMenuOpen ? (
                    <div className="fixed right-0 top-16">
                        <div className=' w-screen'>
                            <PageHeader />
                        </div>
                        <div className="flex w-screen h-full">
                            <div className='w-[12%] border-l-2  m-2 ml-0 h-[70vh]    p-2 items-center'>
                                <div className='flex flex-col h-full justify-between'>
                                    <Button variant={ 'default' } onClick={ async () => await router.push('new-client') }>إضافة عميل جديد</Button>
                                    <Button variant={ 'outline' } onClick={ () => signOut({ callbackUrl: '/signin' }) }>تسجيل الخروج</Button>
                                </div>
                            </div>
                            <div className='translate-y-1/2 h-44 w-6 bg-zinc-200 rounded-tl-md rounded-bl-md cursor-pointer hover:opacity-80' onClick={ () => setSideMenuOpen(!sideMenuOpen) }>
                                <FiChevronsRight className='w-full h-full text-neutral-400' />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className='fixed right-0 z-50 top-1/2 bottom-1/2 -translate-y-1/2 h-44 w-6 bg-zinc-200 rounded-tl-md rounded-bl-md cursor-pointer hover:opacity-80' onClick={ () => setSideMenuOpen(!sideMenuOpen) }>
                        <FiChevronsLeft className='w-full h-full text-neutral-400' />
                    </div>
                ) }


                <div className={ `h-full ${!sideMenuOpen ? 'relative top-12 w-full container' : ' top-12    relative left-28  w-9/12 bottom-20'}  z-40` }>
                    <div className=' bg-white my-12 w-full h-full rounded-2xl'>
                        { children }
                    </div>
                </div>


            </div >
        </>
    );
}
