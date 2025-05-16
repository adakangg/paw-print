'use client'
import React from 'react';  
import { useForm } from 'react-hook-form';
import { z } from "zod" 
import { zodResolver } from "@hookform/resolvers/zod"    
import { processItem } from '@/utils/supabase/helpers'; 
import { useDeleteItems, useUpsertItems } from '@/hooks/useDatabase'; 
import { Textarea } from '@/components/ui/textarea'; 
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';  
import { Button, FormSubmitButton } from '@/components/ui/button';  
import { TimePicker } from '@/components/ui/time-picker/time-picker'; 
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CalendarIcon } from 'lucide-react';
import { format, formatISO, parseISO } from "date-fns"
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useUserProfile } from '@/hooks/useUser';
import { Tables } from '@/utils/supabase/types';

export default function AppointmentForm({  
    closeForm, 
    selected
}: { 
    closeForm: () => void, 
    selected: Tables<'appointments'> | null 
}) {          
    const { data: user } = useUserProfile()      
    const upsertItem = useUpsertItems()   
    const deleteItem = useDeleteItems()  

    const FormSchema = z.object({
        name: z.string().min(1, { message: "Required" }).max(50, { message: "Max limit of 50 characters" }),
        datetime: z.date(),  
        description: z.string().max(100, { message: "Max limit of 100 characters" }),
    })  

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: selected?.name ?? "",   
            datetime: selected?.datetime ? parseISO(selected?.datetime) : new Date(),  
            description: selected?.description ?? ""
        }
    })   

    async function onSubmit(data: z.infer<typeof FormSchema>) {    
        try {
            await upsertItem.mutateAsync({
                upsert: { 
                    ...processItem(data), 
                    datetime: formatISO(data.datetime), 
                    ...(selected && { id: selected.id }),
                    user_id: user?.id 
                }, 
                table: 'appointments',
                queryKeyId: user?.id 
            }) 
        } catch(err) { 
            toast("Error occurred")
        } 
        closeForm()
    }  

    async function onDelete() {
        try {
            await deleteItem.mutateAsync({ items: selected, table: 'appointments', queryKeyId: user?.id })
        } catch(err) {
            toast("Error occurred")
        }
        closeForm() 
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                    name="datetime"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel className="text-left">DateTime</FormLabel>
                            <Popover>
                                <FormControl>
                                    <PopoverTrigger asChild>
                                        <Button
                                        variant="outline"
                                        className={cn(
                                            "w-[280px] justify-start text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                        )}
                                        >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {field.value ? (
                                            format(field.value, "PPP")
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                        </Button>
                                    </PopoverTrigger>
                                </FormControl>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        initialFocus
                                    /> 
                                </PopoverContent>
                            </Popover> 
                            <TimePicker
                                setDate={field.onChange}
                                date={field.value}
                            /> 
                        </FormItem>
                    )}
                />    
              
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