
//     const FormSchema = z.object({
//         name: z.string().min(1, { message: "Required" }).max(50, { message: "Max limit of 50 characters" }),
//         datetime: z.date(), 
//         schedule_type: z.enum(scheduleType),
//         days: z.string().array(),
//         description: z.string().max(100, { message: "Max limit of 100 characters" }),
//     })  

//     const form = useForm<z.infer<typeof FormSchema>>({
//         resolver: zodResolver(FormSchema),
//         defaultValues: {
//             name: selected?.name ?? "",  
//             datetime: new Date(),
//             days: [],
//             schedule_type: selected?.schedule_type ?? scheduleType[0],
//             // datetime: selected?.datetime ? parse(selected?.datetime, 'yyyy-MM-dd', new Date()) : new Date(), 
//             description: selected?.description ?? ""
//         }
//     }) 
//     const { register, watch } = form; 
//     const selectedSchedule = watch("schedule_type");


// <FormField
// control={form.control}
// name="schedule_type"
// render={({ field }) => (
//     <FormItem className='flex flex-col'>
//         <FormLabel>Recurrence</FormLabel>
//         <Select 
//             onValueChange={field.onChange} 
//             defaultValue={field.value}  
//             {...register("schedule_type")} 
//         >
//             <FormControl>
//             <SelectTrigger  className='min-w-35'>
//                 <SelectValue placeholder={scheduleType[0]} />
//             </SelectTrigger>
//             </FormControl>
//             <SelectContent>
//                 { scheduleType.map((type) => 
//                     <SelectItem value={type} key={type}> 
//                         {type}
//                     </SelectItem>
//                 )}  
//             </SelectContent>
//         </Select> 
//         <FormMessage />
//     </FormItem>
// )}
// />  

// { selectedSchedule === 'weekly' &&
// <FormField
// control={form.control}
// name="days"
// render={({ field }) => (
//     <FormItem>
//         <FormLabel>Day of Week</FormLabel>
//         <FormControl>
//             <ToggleGroup variant="outline" type="multiple" onValueChange={field.onChange} >
//                 {
//                     daysOfWeek.map((day) => 
//                         <ToggleGroupItem value={day}>{day}</ToggleGroupItem>
//                     )
//                 } 
//             </ToggleGroup>
//         </FormControl>   
//     </FormItem>
// )}
// /> 
// }

{/* <div className="flex items-center py-4">
    <Input
        placeholder="Filter names..."
        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
        }
        className="max-w-sm"
    /> 
</div> */}
