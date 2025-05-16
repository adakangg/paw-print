'use client'
import React from 'react';  
import { useForm } from 'react-hook-form';
import { z } from "zod" 
import { zodResolver } from "@hookform/resolvers/zod"  
import { procedureType } from '@/utils/supabase/enums'  
import { processItem } from '@/utils/supabase/helpers'; 
import { useDeleteItems, useUpsertItems } from '@/hooks/useDatabase';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button, FormSubmitButton } from '../ui/button';  
import { Textarea } from '../ui/textarea'; 
import { Input } from '../ui/input'; 
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select" 
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { format, parse } from "date-fns"
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Tables } from '@/utils/supabase/types';

export default function ProcedureForm({  
    closeForm,
    petId,
    selected
}: { 
    closeForm: () => void,
    petId: string;
    selected: Tables<'procedures'> | null 
}) {      
    const upsertItem = useUpsertItems()   
    const deleteItem = useDeleteItems()  

    const FormSchema = z.object({
        name: z.string().min(1, { message: "Required" }).max(50, { message: "Max limit of 50 characters" }),
        date: z.date(),
        type: z.enum(procedureType),  
        description: z.string().max(100, { message: "Max limit of 100 characters" }),
    })  

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: selected?.name ?? "", 
            date: selected?.date ? parse(selected?.date, 'yyyy-MM-dd', new Date()) : new Date(),
            type: selected?.type ?? procedureType[0], 
            description: selected?.description ?? ""
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
                table: 'procedures',
                queryKeyId: petId
            }) 
        } catch(err) {
            toast("Error occurred")
        }
        closeForm()
    }  

    async function onDelete() {
        try {
            await deleteItem.mutateAsync({ items: selected, table: 'procedures', queryKeyId: petId })
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

                    <div className='flex-row-center gap-10 justify-between'> 
                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-[240px] pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange} 
                                            initialFocus
                                        />
                                        </PopoverContent>
                                    </Popover> 
                                    <FormMessage />
                                </FormItem>
                            )}
                            />
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem  className='w-full'>
                                <FormLabel>Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger className='w-full'>
                                        <SelectValue placeholder="Select a verified email to display" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        { procedureType.map((type) => 
                                            <SelectItem value={type} key={type}> 
                                                {type}
                                            </SelectItem>
                                        )}  
                                    </SelectContent>
                                </Select> 
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