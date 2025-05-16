'use client'
import React from 'react';  
import { useForm } from 'react-hook-form';
import { z } from "zod" 
import { zodResolver } from "@hookform/resolvers/zod" 
import { useUpsertItems } from '@/hooks/useDatabase';  
import useSupabaseBrowser from '@/utils/supabase/clients'; 
import { addStorageFile } from '@/hooks/useDatabase';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { FormSubmitButton } from '../ui/button';  
import { Input } from '../ui/input'; 
import { format, toDate } from "date-fns"
import { toast } from 'sonner';
import { useUserProfile } from '@/hooks/useUser';

export default function FileForm({ 
    closeForm,
    folderId
}: { 
    closeForm: () => void;
    folderId: string | undefined | null; 
}) {     
    const { data: user } = useUserProfile()      
    const upsertItem = useUpsertItems()    
    const supabase = useSupabaseBrowser()   
    const fileTypesMap: Map<string, string> = new Map([
        ["image/jpeg", "jpeg"],
        ["image/png", "png"],
        ["application/pdf", "pdf"],
        ["application/msword", "doc"],
        ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "docx"]
    ]);

    const FormSchema = z.object({ file: z.instanceof(File).nullable() })  

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: { file: null } 
    }) 

    async function onSubmit(data: z.infer<typeof FormSchema>) {     
        if (data.file) { 
            try {
                const { name, type, lastModified } = data.file
                const fmtedFile = {  
                    name: name.slice(0, name.lastIndexOf('.')),
                    date: format(toDate(lastModified), "MM-dd-yyyy"),
                    mimetype: fileTypesMap.get(type),
                    user_id: user?.id, 
                    folder_id: folderId,
                    path: await getPicturePath(data.file) 
                }  
                await upsertItem.mutateAsync({ 
                    upsert: fmtedFile, 
                    table: 'files', 
                    queryKeyId: user?.id, 
                    queryKeyName: 'archives' 
                }) 
            } catch(err) {
                toast("Error occurred")
            } 
            closeForm() 
        } 
    }  

    async function getPicturePath(file: File | null) {    
        if (file) { 
            const addedFilePath = await addStorageFile(file, 'files', supabase);
            return addedFilePath; 
        } 
    } 

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6"> 
                <FormField
                    control={form.control}
                    name="file"
                    render={({ field }) => (
                        <FormItem> 
                            <FormControl>
                                <Input 
                                    accept="image/*, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                    type="file" 
                                    onChange={(e) => {
                                        const file = e.target.files ? e.target.files[0] : null  
                                        field.onChange(file) 
                                    }}   
                                /> 
                            </FormControl>  
                        </FormItem>
                    )}
                />    
                <FormSubmitButton />
            </form>
      </Form>
    )
}   