import React, { ReactNode } from 'react';
import Header from './Header';
import PageHeader from './PageHeader';
import { Button } from './ui/button';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function Layout({ children, currentPath, prevPath }: {
    children: ReactNode;
    currentPath?: { arabicName: string, path: string; };
    prevPath?: { arabicName: string, path: string; };
})
{
    const router = useRouter();
    return (
        <div className="w-screen h-full pb-20 flex flex-col items-end relative ">

            <Header currentPath={ currentPath } prevPath={ prevPath } />

            <div className="fixed right-0 top-16">

                <div className=' w-screen '>
                    <PageHeader />
                </div>
                <div className="flex w-screen h-full ">
                    <div className='w-2/12   border-l-2  m-2 h-[70vh]    p-8 items-center'>
                        <div className='flex flex-col h-full justify-between '>

                            <Button variant={ 'default' } onClick={ async () => await router.push('new-client') }>إضافة عميل جديد</Button>
                            <Button variant={ 'outline' } onClick={ () => signOut({ callbackUrl: '/signin' }) }>تسجيل الخروج</Button>
                        </div>
                    </div>
                </div>
            </div>


            <div className='h-full  top-12    relative left-28  w-8/12 bottom-20'>
                <div className=' bg-white my-20 w-full h-full rounded-2xl'>
                    { children }
                </div>
            </div>


        </div>
    );
}
