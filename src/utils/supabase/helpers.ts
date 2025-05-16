import { TypedSupabaseClient } from "./types"  

export async function insertItem(client: TypedSupabaseClient, items: any[], table: string) {  
   const { data } = await client
    .from(table as any)
    .insert(items) 
    .throwOnError()     
     
  return data
}

export async function upsertItem(client: TypedSupabaseClient, items: any[], table: string) {  
   const { data } = await client
    .from(table as any)
    .upsert(items) 
    .throwOnError()     
     
  return data
}

export async function deleteItem(client: TypedSupabaseClient, itemIds: string[], table: string) {   
  await client
    .from(table as any)
    .delete()
    .in('id', itemIds) 
    .throwOnError()     
}

// ensure empty strings converted to null values
export function processItem(obj: any) {
  const fmtedItem: Record<string, any> = {}; 
  for (const key in obj) { 
    const value = obj[key]; 
    fmtedItem[key] = value === "" ? null : value; 
  }
  return fmtedItem
}

export function toFormData(data: Record<string, any>): FormData {
  const formData = new FormData(); 
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value.toString()) 
  }); 
  return formData;
}

export function replaceCharsRegex(str: string, target: string, replacement: string): string {
  const regex = new RegExp(target, "g"); 
  return str.replace(regex, replacement);
}