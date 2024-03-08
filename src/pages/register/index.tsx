/* eslint-disable @typescript-eslint/no-misused-promises */
import { useSession } from 'next-auth/react';
import { Cairo } from 'next/font/google';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import { useForm, type SubmitHandler } from "react-hook-form";
import { api } from '~/utils/api';
// import PageLayout from '~/components/PageLayout';
import { Button } from '~/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '~/components/ui/input';
import Layout from '~/components/Layout';

type Inputs = {
    username: string,
    password: string,
    name: string,
    checkPassword: string;
};

const formSchema = z.object({
    username: z.string(),
    name: z.string(),
    password: z.string(),
    checkPassword: z.string(),
});




export default function Register()
{

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    // const createUserMutation = api.users.createUser.useMutation();


    const { status } = useSession();
    const router = useRouter();
    if (status === 'authenticated')
    {
        void router.push('/');
    }
    const onSubmit: SubmitHandler<Inputs> = async (values) =>
    {

        if (values.password === values.checkPassword)
        {
            // const createUser = await createUserMutation.mutateAsync({
            //     password: values.password,
            //     username: values.username,
            //     name: values.name,
            // }).then((res) => { console.log('createUser', res); }).catch((e) => { console.log('e', e); });

        }


        if (values.password !== values.checkPassword)
        {
            form.setError('password', {
                message: 'كلمة السر غير مطابقة'
            });
        }


    };
    return (
        <>
            <Head>
                <title>التسجيل</title>
            </Head>
            {/* <PageLayout title="تسجيل الحساب"> */ }
            <div className='flex flex-col justify-center items-center bg-zinc-50'>

                <div className='w-full text-center my-12'>
                    <h2 className='text-3xl text-primary'>تسجيل حساب</h2>
                    <div className="flex flex-col justify-center items-center text-xl ">

                        <Form  { ...form }>
                            <form onSubmit={ form.handleSubmit(onSubmit) } className="space-y-12 w-80 m-auto  p-8  ">
                                <FormField
                                    control={ form.control }
                                    name="name"
                                    render={ ({ field }) => (
                                        <FormItem className="" >
                                            <FormLabel className='text-xl'>الاسم </FormLabel>
                                            <FormControl>
                                                <Input placeholder="الاسم" { ...field } />
                                            </FormControl>
                                            {/* <FormDescription>
                                    This is your public display name.
                                </FormDescription> */}
                                            <FormMessage />
                                        </FormItem>
                                    ) }
                                />
                                <FormField
                                    control={ form.control }
                                    name="username"
                                    render={ ({ field }) => (
                                        <FormItem className="" >
                                            <FormLabel className='text-xl'>اسم الدخول</FormLabel>
                                            <FormControl>
                                                <Input placeholder="اسم الدخول" { ...field } />
                                            </FormControl>
                                            {/* <FormDescription>
                                This is your public display name.
                            </FormDescription> */}
                                            <FormMessage />
                                        </FormItem>
                                    ) }
                                />
                                <FormField
                                    control={ form.control }
                                    name="password"
                                    render={ ({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xl">كلمة السر</FormLabel>
                                            <FormControl>
                                                <Input placeholder="كلمة السر" { ...field } />
                                            </FormControl>
                                            {/* <FormDescription>
                                This is your public display name.
                            </FormDescription> */}
                                            <FormMessage />
                                        </FormItem>
                                    ) }
                                />
                                <FormField
                                    control={ form.control }
                                    name="checkPassword"
                                    render={ ({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xl">أعد كتابة كلمة المرور</FormLabel>
                                            <FormControl>
                                                <Input placeholder="أعد كتابة كلمة المرور" { ...field } />
                                            </FormControl>
                                            {/* <FormDescription>
                                This is your public display name.
                            </FormDescription> */}
                                            <FormMessage />
                                        </FormItem>
                                    ) }
                                />
                                <Button type="submit">الدخول</Button>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
            {/* </PageLayout> */ }
            {/* <div className="flex min-h-screen flex-col items-center justify-center ">
                <h1 className={ `${cairo.className} text-3xl text-black mb-16 ` }>
                    منظومة المدرسة
                </h1>
                <div className={ `flex ${cairo.className} p-20 rounded-xl shadow-2xl   flex-col bg-white` } dir='rtl'>
                    <form onSubmit={ handleSubmit(onSubmit) } className="flex items-center text-lg gap-8 flex-col m-auto">
                       
                        <input className='w-60 border border-zinc-400 h-14 p-2 shadow-md rounded-xl bg-zinc-200 ' placeholder="اسم الدخول" required { ...register("username") } />
                        { errors.password && <p>{ errors.password.message }</p> }
                        <input type='password' className='w-60 shadow-md border border-zinc-400 h-14 p-2 rounded-xl bg-zinc-200' placeholder="كلمة المرور" required { ...register("password") } />

                        <input type='password' className='w-60 shadow-md h-14 p-2 rounded-xl border border-zinc-400 bg-zinc-200 ' placeholder="أعد إدخال كلمة المرور" required { ...register("checkPassword") } />
                        <input className='w-60 border border-zinc-400 h-14 p-2 shadow-md rounded-xl bg-zinc-200 ' placeholder="الاسم" required { ...register("name") } />
                     
                        <button type="submit" className={ `bg-rose-600 w-full h-14 rounded-xl text-white shadow-md text-2xl ${cairoLight.className}` }>سجل الحساب</button>
                    </form>
                </div>
            </div> */}
        </>
    );
}