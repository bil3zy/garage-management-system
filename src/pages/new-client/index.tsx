import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Textarea } from '~/components/ui/textarea';
import { api } from '~/utils/api';

const formSchema = z.object({
    firstName: z.string().min(0).max(25),
    lastName: z.string().min(0).max(25),
    phone: z.string().min(0).max(10, "الرقم يجب أن لا يتجاوز العشرةأرقام"),
    address: z.string().min(0).max(50),

    uniqueDepartmentNumber: z.string().min(0).max(5),
    registrationNumber: z.string().min(2).max(50),
    yearOfManufacture: z.number().gt(1900).lte(new Date().getFullYear()),
    model: z.string().min(2).max(50),
    mechanicId: z.string(),
    task: z.string()
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
            mechanicId: "",
            task: ""
        },
    });

    const createJobMutation = api.jobs.create.useMutation();
    const router = useRouter();
    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>)
    {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.

        console.log(values);

        const createdJob = await createJobMutation.mutateAsync({
            client: {
                address: values.address,
                firstName: values.firstName,
                lastName: values.lastName,
                phone: values.phone
            },
            vehicle: {
                registrationNumber: values.registrationNumber,
                model: values.model,
                yearOfManufacture: values.yearOfManufacture
            },
            job: {
                mechanicId: values.mechanicId,
                task: values.task
            }
        });
        console.log(createdJob);
        if (createdJob)
        {
            void router.push('/');
        }

    }
    return (
        <Layout currentPath={ { arabicName: 'إضافة العميل', path: 'new-client' } } prevPath={ { arabicName: 'الرئيسية', path: '/' } } >
            <Form { ...form } >
                <form onSubmit={ form.handleSubmit(onSubmit) } className="flex justify-center items-center flex-col py-8 ">
                    <Card className='space-y-8 my-8 py-8 px-4 flex flex-col justify-center items-center w-10/12'>
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
                            <div className='flex flex-row gap-8 flex-wrap w-fit justify-center items-center'>


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
                            </div>
                        </CardContent>
                        <CardContent className={ `flex flex-col gap-8 flex-wrap w-fit justify-center items-center` }>
                            <FormField
                                control={ form.control }
                                name="mechanicId"
                                render={ ({ field }) => (
                                    <FormItem>
                                        <FormLabel>الفني</FormLabel>
                                        <Select onValueChange={ field.onChange } defaultValue={ field.value }>
                                            <FormControl>
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue placeholder="الفني" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="mechanicId">الفني</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                ) }
                            />
                            <div className="grid w-96 gap-2">
                                <FormField
                                    control={ form.control }
                                    name="task"
                                    render={ ({ field }) => (
                                        <FormItem className='w-full '>
                                            <FormLabel>أعمال الصيانة</FormLabel>
                                            <FormControl>
                                                <Textarea className='w-full h-32' placeholder="أعمال الصيانة المطلوبة"
                                                    { ...field } />
                                            </FormControl>
                                        </FormItem>
                                    ) }
                                />
                                {/* <Button>سجل أعمال الصيانة</Button> */ }
                            </div>
                        </CardContent>
                    </Card>
                    <Button type="submit">الإضافة</Button>
                </form>
            </Form >

        </Layout >
    );
}
