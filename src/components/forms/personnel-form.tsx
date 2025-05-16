'use client'
import React from 'react'; 
import { useForm } from 'react-hook-form';
import { z } from "zod" 
import { zodResolver } from "@hookform/resolvers/zod"
import { useDeleteItems, useUpsertItems } from '@/hooks/useDatabase';  
import { personnelType } from '@/utils/supabase/enums';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { FormSubmitButton } from '../ui/button';   
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';
import { Input } from '../ui/input';
import { useUserProfile } from '@/hooks/useUser';
import { toast } from 'sonner';
import { processItem } from '@/utils/supabase/helpers';
import { Tables } from '@/utils/supabase/types';

export default function PersonnelForm({ 
    selected,
    closeForm 
}: { 
    selected: Tables<'personnel'> | null
    closeForm: () => void 
}) {    
    const { data: user } = useUserProfile()      
    const upsertItem = useUpsertItems()    
    const deleteItem = useDeleteItems()  

    const FormSchema = z.object({
        name: z.string().min(1, { message: "Required" }).max(50, { message: "Max limit of 50 characters" }),
        location: z.string().max(50, { message: "Max limit of 50 characters" }),
        phone: z.string().max(50, { message: "Max limit of 20 characters" }),
        email: z.string().max(50, { message: "Max limit of 50 characters" }),
        type: z.enum(personnelType)
    })  

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: selected?.name ?? "",
            location: selected?.location ?? "",
            phone: selected?.phone ?? "", 
            email: selected?.email ?? "",
            type: selected?.type ?? personnelType[0]
        }, 
    }) 

    async function onSubmit(data: z.infer<typeof FormSchema>) {   
        try {
            await upsertItem.mutateAsync({
                upsert: { 
                    ...processItem(data), 
                    ...(selected && { id: selected.id }),
                    user_id: user?.id 
                },
                table: 'personnel',
                queryKeyId: user?.id
            }) 
        } catch(err) { 
            toast("Error occurred")
        } 
        closeForm()
    }  

    async function onDelete() {
        try {
            await deleteItem.mutateAsync({ items: selected, table: 'personnel', queryKeyId: user?.id })
        } catch(err) {
            toast("Error occurred")
        }
        closeForm() 
    }
 
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className='grid grid-cols-2 gap-4'>
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl> 
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Location</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl> 
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl> 
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl> 
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            
                <FormField
                    control={form.control}
                    name="type" 
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Type</FormLabel>
                            <FormControl>
                                <ToggleGroup 
                                    type="single"
                                    value={field.value}
                                    onValueChange={field.onChange}  
                                    className='bg-transparent'
                                >
                                    { personnelType.map((type) => 
                                        <ToggleGroupItem 
                                            value={type} 
                                            key={type} 
                                            className='h-full mr-3 border border-card-border rounded-sm'
                                        > 
                                            {type}
                                        </ToggleGroupItem>
                                    )} 
                                </ToggleGroup>
                            </FormControl>   
                        </FormItem>
                    )}
                />  
                <FormSubmitButton {...(selected && { onDelete: onDelete })} />
            </form>
      </Form>
    );
}   