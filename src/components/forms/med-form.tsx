'use client'
import React from 'react';  
import { useForm } from 'react-hook-form';
import { z } from "zod" 
import { zodResolver } from "@hookform/resolvers/zod"   
import { processItem } from '@/utils/supabase/helpers';
import { useDeleteItems, useUpsertItems } from '@/hooks/useDatabase';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { FormSubmitButton } from '../ui/button';  
import { Textarea } from '../ui/textarea'; 
import { Input } from '../ui/input';  
import { toast } from 'sonner';
import { Tables } from '@/utils/supabase/types';
 
export default function MedicationForm({  
    closeForm,
    petId,
    selected
}: { 
    closeForm: () => void,
    petId: string;
    selected: Tables<'medications'> | null 
}) {      
    const upsertItem = useUpsertItems()   
    const deleteItem = useDeleteItems()   

    const FormSchema = z.object({
        name: z.string().min(1, { message: "Required" }).max(50, { message: "Max limit of 50 characters" }),
        dosage: z.string().max(25, { message: "Max limit of 25 characters" }),
        description: z.string().max(100, { message: "Max limit of 100 characters" })
    })  

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: selected?.name ?? "", 
            dosage: selected?.dosage ?? "", 
            description: selected?.description ?? "", 
        }
    }) 

    async function onSubmit(data: z.infer<typeof FormSchema>) {     
        try {
            await upsertItem.mutateAsync({ 
                upsert: { 
                    ...processItem(data), 
                    ...(selected && { id: selected.id }),
                    pet_id: petId
                }, 
                table: 'medications',
                queryKeyId: petId  
            }) 
        } catch(err) {
            toast("Error occurred")
        }
        closeForm()
    }  

    async function onDelete() {
        try {
            await deleteItem.mutateAsync({ items: selected, table: 'medications', queryKeyId: petId })
        } catch(err) {
            toast("Error occurred")
        }
        closeForm()
    }

    return (
        <Form {...form}>
               <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className='flex-row-center gap-10 justify-between'>
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

                        <FormField
                            control={form.control}
                            name="dosage"
                            render={({ field }) => (
                                <FormItem className='w-full'>
                                    <FormLabel>Dosage</FormLabel>
                                    <FormControl>
                                        <Input {...field}/>
                                    </FormControl> 
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>  

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem> 
                                <FormLabel>Notes</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Type notes here"
                                        className="resize-none min-h-30"
                                        {...field}
                                    />
                                </FormControl> 
                                <FormMessage />
                            </FormItem>
                        )}
                    /> 
                
                <FormSubmitButton {...(selected && { onDelete: onDelete })} />
            </form>
        </Form>
    )
}   