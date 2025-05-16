'use client'
import React from 'react';  
import { useForm } from 'react-hook-form';
import { z } from "zod" 
import { zodResolver } from "@hookform/resolvers/zod"  
import { toFormData } from '@/utils/supabase/helpers';  
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { FormSubmitButton } from '../ui/button';   
import { Input } from '../ui/input';  

export default function LoginForm({  
    filled,
    onSubmitClick, 
}: { 
    filled: boolean,
    onSubmitClick: (formData: FormData) => Promise<void>
}) {        
    const FormSchema = z.object({ 
        email: z.string().email().min(1, { message: "Required" }),
        password: z.string().min(1, { message: "Required" }) 
    })  

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: { 
            email: filled ? process.env.NEXT_PUBLIC_DEMO_EMAIL : "",
            password: filled ? process.env.NEXT_PUBLIC_DEMO_PASSWORD : ""
        }
    }) 

    async function onSubmit(data: z.infer<typeof FormSchema>) {     
        onSubmitClick(toFormData(data))
    }   

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">  
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem className='w-full'>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                                <Input {...field}/>
                            </FormControl> 
                            <FormMessage />
                        </FormItem>
                    )}
                />  

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem className='w-full'>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" {...field}/>
                            </FormControl> 
                            <FormMessage />
                        </FormItem>
                    )}
                />   
                <FormSubmitButton className='w-full text-[1.1rem]'/> 
            </form>
        </Form>
    )
}   