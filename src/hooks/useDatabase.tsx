import useSupabaseBrowser from '@/utils/supabase/clients';  
import { useMutation, useQueryClient } from "@tanstack/react-query";  
import { deleteItem, insertItem, upsertItem } from '@/utils/supabase/helpers';
import { TypedSupabaseClient } from '@/utils/supabase/types';
/* eslint-disable react-hooks/rules-of-hooks */

type DeleteMutationArgs = { 
    items: any;
    table: string;
    queryKeyId: string | undefined | null;
    queryKeyName?: string | undefined; 
} 

type UpsertMutationArgs = { 
    upsert?: any;
    insert?: any;
    table: string;
    queryKeyId?: string | undefined | null;
    queryKeyName?: string | undefined;
    extraQuery?: { name: string ; id : string }
}
   
export function useUpsertItems() { 
    const supabase = useSupabaseBrowser()  
    const queryClient = useQueryClient()
    
    return useMutation({
        mutationFn: async ({ upsert, insert, table, queryKeyId }: UpsertMutationArgs) => {  
            try {
                if (upsert) {
                    const upsertArray = Array.isArray(upsert) ? upsert : [upsert]
                    await upsertItem(supabase, upsertArray, table)  
                } 
                if (insert) {
                    const insertArray = Array.isArray(insert) ? insert : [insert]
                    await insertItem(supabase, insertArray, table)  
                } 
            } catch (err) { 
                throw err
            }
        }, 
        onSuccess: (data, variables, context) => { 
            if (variables.queryKeyId) {
                queryClient.invalidateQueries({ 
                    queryKey: [variables.queryKeyName ?? variables.table, variables.queryKeyId] }
                ) 
            }  
            if (variables.extraQuery) { 
                queryClient.invalidateQueries({ 
                    queryKey: [variables.extraQuery.name, variables.extraQuery.id] }
                ) 
            }
      } 
    })
}   
  
export function useDeleteItems() { 
    const supabase = useSupabaseBrowser()  
    const queryClient = useQueryClient();  
    
    return useMutation({
        mutationFn: async ({ items, table, queryKeyId, queryKeyName }: DeleteMutationArgs) => {
            try {
                const formattedItems = Array.isArray(items) ? items : [items];
                const itemIds = formattedItems.map((item) => item.id)
                await deleteItem(supabase, itemIds, table);
            } catch(err) {
                throw err
            }
        },
        onSuccess: (data, variables, context) => { 
            if (variables.queryKeyId) {
                queryClient.invalidateQueries({ 
                    queryKey: [variables.queryKeyName ?? variables.table, variables.queryKeyId] }
                ) 
            }  
        } 
    })
} 

export async function addStorageFile(file: File, folder: string, supabase: TypedSupabaseClient) {   
    const filePath = `${folder}/${ Date.now() + "-" + sanitizeKey(file.name) }` 
    const { error } = await supabase.storage
        .from('uploads') 
        .upload(filePath, file, { upsert: false }); 
    if (error) throw new Error()
  
    const { data } = supabase
        .storage
        .from('uploads')
        .getPublicUrl(filePath); 
    return !data.publicUrl ? '' : data.publicUrl; 
}  
   
export async function deleteStorageFile(filePath: string) {  
    const supabase = useSupabaseBrowser()  
    const { error } = await supabase.storage
        .from('uploads')
        .remove([filePath]); 
    if (error) throw new Error(); 
}

// ensure valid file names 
function sanitizeKey(key: string): string { return key.replace(/[^a-zA-Z0-9/_\-\.]/g, "") }