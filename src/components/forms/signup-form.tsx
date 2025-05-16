'use client'
import React from 'react';  
import { useForm } from 'react-hook-form';
import { z } from "zod" 
import { zodResolver } from "@hookform/resolvers/zod"   
import { toFormData } from '@/utils/supabase/helpers';  
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { FormSubmitButton } from '../ui/button';   
import { Input } from '../ui/input';  

export default function SignupForm({  
    onSubmitClick, 
}: { 
    onSubmitClick: (formData: FormData) => Promise<void>
}) {    
    const [error, setError] = React.useState<string | null>(null)  
    const FormSchema = z.object({
        f_name: z.string().min(1, { message: "Required" }).max(50, { message: "Max limit of 50 characters" }),
        l_name: z.string().max(50, { message: "Max limit of 50 characters" }),
        email: z.string().email().min(1, { message: "Required" }),
        password: z.string().min(1, { message: "Required" }) 
    })  

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            f_name: "",
            l_name: "",
            email: "",
            password: ""
        }
    }) 

    async function onSubmit(data: z.infer<typeof FormSchema>) {     
        try {
            await onSubmitClick(toFormData(data)) 
        } catch (err: any) { 
            setError(err?.message ?? "Error occurred")
        }
    }   

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="f_name"
                    render={({ field }) => (
                        <FormItem className='w-full'>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                                <Input {...field}/>
                            </FormControl> 
                            <FormMessage />
                        </FormItem>
                    )}
                />  
                <FormField
                    control={form.control}
                    name="l_name"
                    render={({ field }) => (
                        <FormItem className='w-full'>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                                <Input {...field}/>
                            </FormControl> 
                            <FormMessage />
                        </FormItem>
                    )}
                />  

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
                { error &&  
                    <div className='-mt-4 text-destructive text-[0.8rem]'>
                        {error}
                    </div>
                }
                <FormSubmitButton className='w-full text-[1.1rem]'/> 
            </form>
        </Form>
    )
}   