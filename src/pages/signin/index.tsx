"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "~/components/ui/button";
import { GiMechanicGarage } from "react-icons/gi";
import
{
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import Layout from '~/components/Layout';
import { RouterOutputs, api } from '~/utils/api';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const formSchema = z.object({
    // username: z.string().min(2).max(50),
    username: z.string(),
    password: z.string(),
});

export default function RegisterPage()
{
    const session = useSession();
    console.log(session);
    const router = useRouter();
    // if (session.status === 'authenticated')
    // {
    //     void router.push('/');
    // }
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    // if (session.status === 'authenticated')
    // {

    //     void router.push('/');

    // }

    // const createLoggerMutation = api.logger.create.useMutation();
    // const findAccountMutation = api.account.findWithQuery.useMutation();

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>)
    {

        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values);
        await signIn('credentials', {
            redirect: true,
            callbackUrl: ('/'),
            username: values.username,
            password: values.password
        },).then((res) => console.log(res)).catch((e) => console.log(e));

        //     .then(async (resAccount,) =>
        // {
        //     console.log('resAccount', resAccount);
        //     const foundAccountMutated: RouterOutputs["account"]["findWithQuery"] = findAccountMutation.mutateAsync({
        //         username: form.getValues().username
        //     });
        //     if (resAccount?.ok)
        //     {


        //         toast.success('تم تسجيل الدخول بنجاح!');
        //     } else
        //     {

        //         toast.error('لقد حدث خطأ ما، الرجاء المحاولة لاحقا.');
        //     }



        // console.log(resAccount);
        // });

        // if (values.checkPassword === values.password)
        // {
        //     const createdAccount = await createAccountMutation.mutateAsync({
        //         user
        // }

    }

    return (
        <>
            {/* <Toaster /> */ }
            <div className='w-screen min-h-screen flex justify-center items-center bg-zinc-100'>

                <Form  { ...form }>
                    <form onSubmit={ form.handleSubmit(onSubmit) } className="space-y-12 bg-stone-50 h-fit rounded-2xl flex flex-col items-center justify-center drop-shadow-lg w-5/12 m-auto p-16  ">
                        <GiMechanicGarage size={ 60 } />
                        <FormField
                            control={ form.control }
                            name="username"
                            render={ ({ field }) => (
                                <FormItem className="w-64" >
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
                                <FormItem className="w-64">
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
                        <Button variant={ 'default' } type="submit">الدخول</Button>
                    </form>
                </Form >

            </div>
        </>
    );
}
