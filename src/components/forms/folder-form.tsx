'use client'
import React from 'react';  
import { useForm } from 'react-hook-form';
import { z } from "zod" 
import { useUserProfile } from '@/hooks/useUser';
import { zodResolver } from "@hookform/resolvers/zod"    
import { processItem } from '@/utils/supabase/helpers'; 
import { useUpsertItems } from '@/hooks/useDatabase';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { FormSubmitButton } from '../ui/button';  
import { Input } from '../ui/input';  
import { toast } from 'sonner';
import { ExtendedFolder } from '@/hooks/useArchives';

export default function FolderForm({  
    closeForm, 
    selected
}: { 
    closeForm: () => void, 
    selected?: ExtendedFolder | null | undefined
}) {      
    const { data: user } = useUserProfile()      
    const upsertItems = useUpsertItems()    

    const FormSchema = z.object({
        name: z.string().min(1, { message: "Required" }).max(50, { message: "Max limit of 50 characters" }) 
    })  

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: { name: selected?.name ?? "" }
    }) 

    async function onSubmit(data: z.infer<typeof FormSchema>) {   
        try { 
            await upsertItems.mutateAsync({ 
                upsert: { 
                    ...processItem(data), 
                    ...(selected && { id: selected.id }), 
                    user_id: user?.id
                }, 
                table: 'folders', 
                queryKeyId: user?.id,
                queryKeyName: 'archives'
            })  
        } catch(err) { 
            toast("Error occurred")
        } 
        closeForm()
    }   

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem className='w-full'>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input {...field}/>
                            </FormControl> 
                            <FormMessage />
                        </FormItem>
                    )}
                />  
                <FormSubmitButton />
            </form>
        </Form>
    )
}   