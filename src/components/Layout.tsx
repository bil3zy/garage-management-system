import React from 'react';
import Header from './Header';
import PageHeader from './PageHeader';

export default function Layout({ children }: { children: React.ReactNode; })
{
    return (
        <div className="w-screen h-full flex flex-col  bg-zinc-50">
            <Header />
            <div className='relative w-screen right-0'>
                <PageHeader />
            </div>
            <div className="flex w-screen h-full relative ">

                <div className='w-2/12 relative  border-l-2  m-2 h-[70vh]  p-8 items-center'>
                    <div className='flex flex-col sticky top-0'>

                        <ul>
                            <li>ورشتي</li>
                            <li>ورشتي</li>
                            <li>ورشتي</li>
                            <li>ورشتي</li>
                        </ul>
                    </div>
                </div>

                <div className='h-full rounded-2xl relative w-9/12 bg-white mx-12'>

                    { children }
                </div>
            </div>
        </div>
    );
}
