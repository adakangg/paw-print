'use client'
import React from 'react';  
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from "zod" 
import { zodResolver } from "@hookform/resolvers/zod"  
import { useDeleteItems, useUpsertItems } from '@/hooks/useDatabase'; 
import { Form } from '@/components/ui/form';
import { Button, FormSubmitButton, IconButton } from '../ui/button';  
import { Input } from '../ui/input';  
import { Plus, X } from 'lucide-react'; 
import { toast } from 'sonner';
import { Tables } from '@/utils/supabase/types';

export default function AllergyForm({  
    closeForm,
    petId,
    selected
}: { 
    closeForm: () => void,
    petId: string;
    selected: Tables<'allergies'>[] | null 
}) {       
    const upsertItems = useUpsertItems()   
    const deleteItems = useDeleteItems()   

    const FormSchema = z.object({ allergies: z.array(z.any()) })   

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema), 
        defaultValues: { allergies: selected ?? [] }
    }) 

    const { control } = form; 
    const { fields, append, remove } = useFieldArray({ control, name: "allergies" });

    async function onSubmit(data: z.infer<typeof FormSchema>) {    
        const unchanged: Tables<'allergies'>[] = []
        const added: Partial<Tables<'allergies'>>[] = []
        data.allergies.map((allergy) =>{
            if (allergy.id) {
                unchanged.push(allergy)
            } else {
                added.push(allergy)
            }
        }) 

        try {
            const removed = selected?.filter((orig) => !data.allergies.some((allergy) => allergy.id === orig.id)); 
            await deleteItems.mutateAsync({ items: removed, table: 'allergies', queryKeyId: petId })
            await upsertItems.mutateAsync({ 
                upsert: unchanged, 
                insert: added, 
                queryKeyId: petId, 
                table: 'allergies'
            }) 
        } catch(err) {
            toast("Error occurred")
        }
        closeForm()
    }   

    return ( 
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-4">
                <div className='flex-col-center gap-6'>
                    {fields.map((field, index) => {
                        return (
                            <div key={index} className='flex-row-center w-full gap-2 pr-10'> 
                                <IconButton 
                                    icon={ <X width={16} height={16} /> } 
                                    onClick={() => remove(index)}
                                />  
                                <Input {...form.register(`allergies.${index}.name`)} />  
                            </div>
                        );
                    })}
                    <Button 
                        type="button" 
                        variant='outline'
                        onClick={() => append({ pet_id: petId, name: "" })}
                    >
                        <Plus width={16} height={16}/>
                        Add Allergy
                    </Button>
                </div>  
                <FormSubmitButton />
            </form> 
        </Form>
    )
}   