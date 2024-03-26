"use client";

import React from 'react';
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { api } from '~/utils/api';
import { Mirza } from 'next/font/google';

const formSchema = z.object({
    name: z.string().min(2).max(50),
    broughtBy: z.string(),
    price: z.number()
});


const mirza = Mirza({ weight: '500', subsets: ['arabic'] });

export default function AddItemsForm({ jobId, setOpen }: { jobId: string; setOpen: React.Dispatch<React.SetStateAction<boolean>>; })
{
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            broughtBy: "",
            price: 0,
        },
    });

    const createItemMutation = api.items.create.useMutation({});
    const utils = api.useUtils();

    console.log('jobId', jobId);
    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>)
    {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values);
        const createdItem = await createItemMutation.mutateAsync({
            items: {

                name: values.name,
                price: values.price,
                broughtBy: values.broughtBy,
                jobId
            }
        }).then(async () =>
        {
            setOpen(false);
            await utils.items.invalidate();
        });
    }


    return (
        <Form { ...form } >
            <form dir='rtl' onSubmit={ form.handleSubmit(onSubmit) } className={ `space-y-8 bg-zinc-50 text-md ${mirza.className}  ` }>
                <FormField
                    control={ form.control }
                    name="name"
                    render={ ({ field }) => (
                        <FormItem>
                            <FormLabel>القطعة</FormLabel>
                            <FormControl>
                                <Input placeholder="القطعة" { ...field } />
                            </FormControl>
                        </FormItem>
                    ) }
                />

                <FormField
                    control={ form.control }
                    name="broughtBy"
                    render={ ({ field }) => (
                        <FormItem>
                            <Select onValueChange={ field.onChange } defaultValue={ field.value }>

                                <FormLabel>مدفوعة من</FormLabel>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="من أحضر القطعة" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent >
                                    <SelectItem value="العميل">العميل</SelectItem>

                                    <SelectItem value="الورشة">الورشة</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormItem>
                    ) }
                />

                <FormField
                    control={ form.control }
                    name="price"
                    render={ ({ field }) => (
                        <FormItem>
                            <FormLabel>السعر</FormLabel>
                            <FormControl onChange={ (e) => field.onChange(Number((e.target as HTMLButtonElement)?.value)) }  >
                                <Input placeholder="السعر" { ...field } />
                            </FormControl>
                        </FormItem>
                    ) }
                />
                <Button type="submit">إضافة القطعة</Button>
            </form>
        </Form >
    );
}
