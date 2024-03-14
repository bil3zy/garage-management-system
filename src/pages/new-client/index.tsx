import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Layout from '~/components/Layout';
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardTitle } from '~/components/ui/card';
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

const formSchema = z.object({
    firstName: z.string().min(0).max(25),
    lastName: z.string().min(0).max(25),
    phone: z.string().min(0).max(10, "الرقم يجب أن لا يتجاوز العشرةأرقام"),
    address: z.string().min(0).max(50),

    uniqueDepartmentNumber: z.string().min(0).max(5),
    registrationNumber: z.string().min(2).max(50),
    yearOfManufacture: z.number().gt(1900).lte(new Date().getFullYear()),
    model: z.string().min(2).max(50),
});

export default function NewClient()
{
    const year = new Date().getFullYear();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            registrationNumber: "",
            uniqueDepartmentNumber: "",
            yearOfManufacture: year,
            model: "",
        },
    });


    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>)
    {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values);
    }
    return (
        <Layout currentPath={ { arabicName: 'إضافة العميل', path: 'new-client' } } prevPath={ { arabicName: 'الرئيسية', path: '/' } } >
            <Form { ...form } >
                <form onSubmit={ form.handleSubmit(onSubmit) } className="flex justify-center items-center flex-col py-8 ">
                    <Card className='space-y-8 my-8 py-8 px-4 flex flex-col justify-center items-center w-9/12'>
                        <CardTitle className='text-3xl'>معلومات العميل</CardTitle>
                        <CardContent className={ `flex flex-row gap-8 flex-wrap w-fit justify-center items-center` }>
                            <FormField
                                control={ form.control }
                                name="firstName"
                                render={ ({ field }) => (
                                    <FormItem>
                                        <FormLabel>الاسم الاول</FormLabel>
                                        <FormControl>
                                            <Input placeholder="الاسم الاول" { ...field } />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                ) }
                            />

                            <FormField
                                control={ form.control }
                                name="lastName"
                                render={ ({ field }) => (
                                    <FormItem>
                                        <FormLabel>الاسم الثاني</FormLabel>
                                        <FormControl>
                                            <Input placeholder="الاسم الثاني" { ...field } />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                ) }
                            />
                            <FormField
                                control={ form.control }
                                name="phone"
                                render={ ({ field }) => (
                                    <FormItem>
                                        <FormLabel>رقم الهاتف</FormLabel>
                                        <FormControl>
                                            <Input placeholder="رقم الهاتف" { ...field } />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                ) }
                            />
                            <FormField
                                control={ form.control }
                                name="address"
                                render={ ({ field }) => (
                                    <FormItem>
                                        <FormLabel>العنوان</FormLabel>
                                        <FormControl>
                                            <Input placeholder="العنوان" { ...field } />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                ) }
                            />
                        </CardContent>
                        <CardTitle className='text-3xl'>معلومات المركبة</CardTitle>
                        <CardContent className={ `flex flex-col gap-8 justify-center items-center` }>
                            <div className="flex flex-row justify-center items-center flex-nowrap ">
                                <FormField
                                    control={ form.control }
                                    name="uniqueDepartmentNumber"
                                    render={ ({ field }) => (
                                        <FormItem className='w-32'>
                                            <FormLabel>رقم التمييز</FormLabel>
                                            <FormControl>
                                                <Input placeholder="رقم التمييز" { ...field } />
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    ) }
                                />
                                <div className='text-3xl mx-8 flex justify-center items-center h-20 lin'>
                                    { '-' }
                                </div>
                                <FormField
                                    control={ form.control }
                                    name="registrationNumber"
                                    render={ ({ field }) => (
                                        <FormItem>
                                            <FormLabel>رقم المركبة</FormLabel>
                                            <FormControl>
                                                <Input placeholder="رقم المركبة" { ...field } />
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    ) }
                                />
                            </div>

                            <FormField
                                control={ form.control }
                                name="yearOfManufacture"
                                render={ ({ field }) =>
                                {

                                    return (
                                        <FormItem>
                                            <FormLabel>تاريخ التصنيع</FormLabel>
                                            <FormControl>
                                                <Input placeholder="تاريخ التصنيع" { ...field } />
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    );
                                } }
                            />

                            <FormField
                                control={ form.control }
                                name="model"
                                render={ ({ field }) => (
                                    <FormItem>
                                        <FormLabel>الموديل</FormLabel>
                                        <FormControl>
                                            <Input placeholder="الموديل" { ...field } />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                ) }
                            />
                        </CardContent>
                    </Card>
                    <Button type="submit">الإضافة</Button>
                </form>
            </Form>

        </Layout >
    );
}
