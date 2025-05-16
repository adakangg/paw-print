'use client'
import { redirect, RedirectType } from 'next/navigation'  
import Link from 'next/link';
import Image from 'next/image';  
import React from 'react';
import { useAppointments, usePersonnel, usePets, useUserProfile} from '@/hooks/useUser' 
import { useUserArchives } from '@/hooks/useArchives'; 
import { cn } from '@/lib/utils'; 
import { toast } from 'sonner'; 
import { PERSONNEL_ICONS, SPECIES_ICONS } from '@/constants' 
import { Calendar } from '@/components/ui/calendar';
import { buttonVariants, IconButton } from '@/components/ui/button'; 
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"   
import { TooltipContent } from '@/components/ui/tooltip'; 
import { FormDialog } from "@/components/ui/dialog"
import PersonnelForm from '@/components/forms/personnel-form';
import { Card } from '@/components/ui/card'; 
import AppointmentForm from '@/components/forms/appointment-form';
import { Badge } from '@/components/ui/badge';
import { format, isSameDay, isSameMonth, parseISO } from 'date-fns';
import { ArrowUpRight, Box, CalendarIcon, Folder, Mail, MapPin, Paperclip, PawPrint, Phone, Plus, UserRound } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { DogInHouseSvg } from '@/components/icons'; 
import { Tables } from '@/utils/supabase/types';
 
function Section({ 
    title,  
    icon,
    color,
    children,
    className
  }: {  
    title: string; 
    icon?: React.ReactNode;
    color: string;
    children?: React.ReactNode;
    className?: string
  }) {    
    return (  
        <div className={cn('flex-col-start rounded-lg h-full', className)}>
            <div className='flex-row-between dotted-border pb-3 mb-2'>
                <span className={`w-fit px-2 text-[1.2rem] font-medium ${color}`}>
                    {title}
                </span>
                {icon}
            </div>
            {children}
        </div> 
    )
} 

function SectionList({ children, className }: { children?: React.ReactNode, className?: string }) {    
    return ( <div className={cn('flex-col-start gap-3', className)}> {children} </div> )
}  

function SectionListItem({ 
    text,  
    id,
    color,
    link,
    icon
  }: {  
    text: string; 
    id?: string;
    color: string;
    link: string; 
    icon?: React.ReactNode;
  }) {    
    return ( 
        <Link key={id ?? text} href={{ pathname: link, ...(id && { query: { id: id } })}}>
            <div className='flex-row-center gap-2'>
                {icon}    
                <p className={`text-[1rem] border-b-separator px-1 ${color} hover:cursor-pointer`}>
                    {text}
                </p> 
            </div>
        </Link>
    )
}     

function Personnel({ 
    person, 
    isLast,
    openForm
}: { 
    person: Tables<'personnel'>, 
    isLast: boolean,
    openForm: (type: string, selected: Tables<'personnel'>) => void
}) {   
    return ( 
        <div onClick={() => openForm('Personnel', person)} className={`flex-row-between px-2 py-4 hover ${ !isLast && 'border-b-separator' }`}>
            <div className='flex-row-center w-fit'> 
                <div className='bg-white rounded-full p-1 border-[1.4px] border-black'>
                    { person.type ? PERSONNEL_ICONS.get(person.type) : <UserRound /> }
                </div>
                 <div className='flex-col-start mx-4'>
                    <p className=''>{person.name}</p>
                    { person.location && 
                        <div className='flex-row-center gap-[2px] text-[0.9rem] text-muted-foreground'>
                            <MapPin width={13} height={13} className='flex shrink-0'/>
                            {person.location} 
                        </div>
                    } 
                </div>
            </div>

            <div className='flex-row-center w-fit gap-7'> 
                <IconButton
                    icon={ <Phone width={18} height={18} className='text-muted-foreground' /> }
                    onClick={() => copyToClipboard(person.phone)}
                    tooltipContent={
                        <TooltipContent className='bg-gray-primary' arrowClassName='bg-gray-primary fill-gray-primary'>
                            {person.phone ?? 'empty'}
                        </TooltipContent>
                    }
                />  
                <IconButton
                    icon={ <Mail width={18} height={18} className='text-muted-foreground' /> }
                    onClick={() => copyToClipboard(person.email)}
                    tooltipContent={
                        <TooltipContent className='bg-gray-primary' arrowClassName='bg-gray-primary fill-gray-primary'>
                            {person.email ?? 'empty'}
                        </TooltipContent>
                    } 
                />   
            </div> 
        </div> 
    )
}

function copyToClipboard(text: string | null) {
    if (text) {
        navigator.clipboard.writeText(text).then(() => { 
            toast("Copied to clipboard") 
        })
    }
}
 
function getApptsByDate(date: Date | undefined, appts: Tables<'appointments'>[] | undefined) {
    if (date && appts && appts.length > 0) {
        return appts.filter((appt) => appt.datetime ? isSameDay(new Date(appt.datetime), date) : false)
    }
    return []
}

function getApptsByMonth(date: Date | undefined, appts: Tables<'appointments'>[] | undefined) {
    if (date && appts && appts.length > 0) {
        return appts.filter((appt) => appt.datetime ? isSameMonth(new Date(appt.datetime), date) : false)
    }
    return []
} 

function ApptsList({ 
    appts, 
    openForm,
    showDate
}: { 
    appts: Tables<'appointments'>[],  
    openForm: (type: string, selected: Tables<'appointments'>) => void,
    showDate?: boolean 
}) { 
    if (appts.length > 0) { 
        return (
            <div className='flex-col-center gap-4'>
                { appts.map((appt) =>  
                    <Card  
                        key={appt.id} 
                        onClick={() => openForm('Appointment', appt)}
                        className='pl-3 w-full hover border-l-4 border-l-blue-primary'
                    >
                        <div className='flex-row-between font-medium mb-2'> 
                            {appt.name}
                            { appt.datetime &&  
                                <Badge className='text-[0.7rem] bg-blue-background text-blue-primary-text py-0'> 
                                    {format(appt.datetime, 'p')} 
                                </Badge>
                            } 
                        </div>  
                        { showDate && appt.datetime &&
                            <div className='flex-row-center gap-1 text-[0.75rem] font-medium'>
                                <CalendarIcon width={13} height={13} />
                                { format(appt.datetime, 'PPP') }
                            </div>
                        }
                        <p className='w-full text-wrap text-[0.8rem] text-muted-foreground'> 
                            {appt.description} 
                        </p>
                    </Card> 
                )  
            }   
            </div>
        )   
    } else {
        return (
            <div className='flex-col-center gap-4 mt-5'>
                <div className='w-fit bg-image-background rounded-sm py-2 px-8'>
                    <Image src='/dog_digging.png' alt='dog' width={100} height={100} />
                </div>
                <p className='font-semibold'>No Events Found</p>
            </div>
        )
    } 
}

function SummaryDetail({
    title,
    text,
    className
}: {
    title: string;
    text: string;
    className?: string;
}) {
    return (
        <div className={cn('flex-col-start border-r-[1px] border-muted-background px-5 w-fit', className)}>
            <p className='text-[0.75rem]'>{title}</p>
            <p className='text-[1rem] font-medium'>{text}</p>
        </div> 
    )
}

function EmptyState({ icon }: { icon: React.ReactElement }) {
    return (
        <div className='flex-col-center justify-center gap-2 h-full w-full mt-1 text-[0.9rem] text-muted-foreground2'>
            {icon}
            None Recorded
        </div>
    )
}

function getSpeciesIcon(species: string, size?: number | undefined) {
    const icon = SPECIES_ICONS.get(species)
    if (icon) return React.cloneElement(icon, { width: size ?? 20, height: size ?? 20 })
    return <PawPrint width={20} height={20} />
}

export default function Dashboard() {     
    const { data: user, isError: userError } = useUserProfile()      
    const { data: pets, isFetching: fetchingPets, error: petsError } = usePets(user?.id) 
    const { data: archives, isFetching: fetchingArchives, error: archivesError } = useUserArchives(user?.id)
    const { data: personnel, isFetching: fetchingPersonnel, error: personnelError } = usePersonnel(user?.id)    
    const { data: appointments, isFetching: fetchingAppts, error: apptsErrors } = useAppointments(user?.id)      
    const isLoading = !user || fetchingPets || fetchingArchives || fetchingPersonnel || fetchingAppts;
    if (userError || petsError || archivesError || personnelError || apptsErrors) { redirect('/error') }   
 
    const [date, setDate] = React.useState<Date | undefined>(new Date()) 

    type FormArgs = { type: string | null, selected: Tables<'personnel'> | Tables<'appointments'> | null };
    const [formData, setFormData] = React.useState<FormArgs>({ type: null, selected: null }); 
    const [formOpen, setFormOpen] = React.useState<boolean>(false);   
    function openForm(type: FormArgs["type"], selected: FormArgs["selected"]) { 
        setFormData({ type: type, selected: selected }) 
        setFormOpen(true)
    }
    function closeForm() {
        setFormData({ type: null, selected: null })
        setFormOpen(false)
    } 
    function getFormType() { 
        if (formData.type === 'Personnel') { 
            return <PersonnelForm selected={formData.selected as Tables<'personnel'>} closeForm={closeForm} />  
        } else if (formData.type === 'Appointment') {
            return <AppointmentForm selected={formData.selected as Tables<'appointments'>} closeForm={closeForm}/>  
        } 
    }  

    return (
        <div className="flex-col-center px-10 pt-20 pb-8">    
            { isLoading && 
                <div className="flex-row-start justify-center gap-6 mt-10">
                    <div className='flex-col-start gap-4 w-fit'>
                        <Skeleton className="h-[280px] w-[280px]" /> 
                        <div className="max-[680px]:hidden flex-row-start gap-4">
                            <Skeleton className="h-[200px] w-[170px]" />
                            <Skeleton className="h-[200px] w-[170px]" />
                            <Skeleton className="h-[200px] w-[170px]" /> 
                        </div>
                    </div>
                    <Skeleton className="max-[680px]:hidden h-[495px] w-[280px]" />
                  
                </div>
            }
             { !isLoading && user && 
                <div className='grid min-[1200px]:grid-cols-[1fr_0fr] gap-20 w-fit'> 
                    <div className='flex-col-start max-w-[700px]'>  
                        <div className='bg-primary pb-3.5 pr-1 rounded-sm mb-5'>
                            <div className='flex-row-between gap-2 pl-6 pr-3 text-[3rem] font-bold border-1 rounded-sm bg-background -ml-3 -mt-5'> 
                                {`Welcome Back ${user.f_name}`} 
                                <DogInHouseSvg className={"fill-foreground stroke-foreground"} style={{width:155, height:155}} />
                            </div>
                        </div>

                        <div className='flex-row-start mb-16'>
                            <SummaryDetail title='Current Pets Tracked' text={`${pets?.length ?? 0} pets`} />
                            <SummaryDetail title='Total Files Uploaded' text={`${archives?.files?.length ?? 0} files`} />
                            <SummaryDetail title='Contacts Saved' text={`${personnel?.length ?? 0} entries`} className='border-0' />
                        </div>
 
                        <div className='w-full grid min-[850px]:grid-cols-2 gap-8'>  
                            <div className='grid grid-cols-2 gap-8'>
                                <Section 
                                    title='All Pets' 
                                    color='bg-orange-primary' 
                                    icon={
                                        <IconButton
                                            icon={ <ArrowUpRight width={16} height={16} className='text-muted-foreground2' /> }
                                            onClick={() => { redirect('/dashboard/pets', RedirectType.push) }}
                                            tooltipContent={
                                                <TooltipContent className='bg-orange-primary' arrowClassName='bg-orange-primary fill-orange-primary'>
                                                    View All
                                                </TooltipContent>
                                            }
                                        />  
                                    }  
                                >
                                    { pets && pets.length > 0 ?  
                                        <SectionList>
                                            { pets?.map((pet) => 
                                                <SectionListItem 
                                                    text={pet.name}
                                                    id={pet.id}
                                                    key={pet.id}    
                                                    icon={getSpeciesIcon(pet.species)}
                                                    color='hover:bg-orange-primary'
                                                    link={`/dashboard/pets/${pet.id}`}
                                                />
                                            )}
                                        </SectionList> 
                                        :
                                        <EmptyState icon={<PawPrint width={36} height={36} />} /> 
                                    }
                                </Section>

                                <Section 
                                    title='Archives' 
                                    color='bg-pink-primary'
                                    icon={
                                        <IconButton
                                            icon={ <ArrowUpRight width={16} height={16} className='text-muted-foreground2' /> }
                                            onClick={() => redirect('/dashboard/archives', RedirectType.push)}
                                            tooltipContent={
                                                <TooltipContent className='bg-pink-primary' arrowClassName='bg-pink-primary fill-pink-primary'>
                                                    View All
                                                </TooltipContent>
                                            }
                                        />  
                                    } 
                                >
                                    { (archives && archives.folders.length > 0) || (archives && archives.files.length > 0) ? 
                                        <SectionList>
                                            { archives?.folders?.map((folder) => 
                                                <SectionListItem 
                                                    text={folder.name}
                                                    id={folder.id}
                                                    key={folder.id}
                                                    color='hover:bg-pink-primary'
                                                    icon={<Folder width={16} height={16}/>}
                                                    link='/dashboard/archives'
                                                />
                                            )}
                                            { archives?.files?.map((file) => 
                                                <SectionListItem 
                                                    text={file.name} 
                                                    key={file.id} 
                                                    color='hover:bg-pink-primary'
                                                    icon={<Paperclip width={16} height={16}/>}
                                                    link='/dashboard/archives'
                                                />
                                            )}
                                        </SectionList> 
                                        :
                                        <EmptyState icon={<Box width={36} height={36} />} />
                                    }
                                </Section>  
                            </div>

                            <Section 
                                title='Directory' 
                                color='bg-gray-primary'
                                icon={
                                    <IconButton
                                        icon={ <Plus width={16} height={16} className='text-muted-foreground2' /> }
                                        onClick={() => openForm('Personnel', null)}
                                        tooltipContent={
                                            <TooltipContent className='bg-gray-primary' arrowClassName='bg-gray-primary fill-gray-primary'>
                                                Add Entry
                                            </TooltipContent>
                                        }
                                    />  
                                }
                                className='min-[850px]:min-w-90'
                            >
                                { personnel && personnel.length > 0 ? 
                                    <SectionList className='gap-0 -mt-4'>
                                        { personnel?.map((person, index) => 
                                            <Personnel 
                                                key={person.id}
                                                person={person}  
                                                isLast={index === personnel.length-1}
                                                openForm={openForm}
                                            /> 
                                        )} 
                                    </SectionList>
                                    :
                                    <EmptyState icon={<UserRound width={36} height={36} />} />
                                }
                            </Section>
                        </div> 
                    </div>  

                    <Section 
                        title='Schedule' 
                        color='bg-blue-primary' 
                        icon={
                            <IconButton
                                icon={ <Plus width={16} height={16} className='text-muted-foreground2' /> }
                                onClick={() => openForm('Appointment', null)}
                                tooltipContent={ <TooltipContent> Add Entry </TooltipContent> }
                            /> 
                        }   
                        className='-mt-6'
                    >
                        <div className='grid w-full gap-6 min-[850px]:grid-cols-2 min-[1200px]:flex-col-center min-[1200px]:gap-4'> 
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate} 
                                modifiers={{  
                                    filled: appointments?.map((appt) => appt.datetime ? parseISO(appt.datetime) : new Date()) ?? []
                                }}
                                modifiersClassNames={{ 
                                    filled: "before:content-[''] before:absolute before:top-0.5 before:right-0.5 before:bg-primary-muted before:w-2 before:h-2 before:rounded-full",
                                }}
                                classNames={{ 
                                    month: 'flex flex-1 flex-col space-y-4 pb-2 px-2 rounded-lg border-1 border-calendar-border',
                                    table: "full border-collapse space-y-1",
                                    nav_button_previous: "absolute left-4 border-0 text-topbar-text bg-topbar", 
                                    nav_button_next: "absolute right-4 border-0 text-topbar-text bg-topbar",
                                    caption_label: "text-topbar-text",
                                    caption: "relative flex flex-1 justify-center py-2 -mx-2 bg-topbar rounded-tl-lg rounded-tr-lg",
                                    head_row: "",  
                                    head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.95rem] pb-3",
                                    row: "w-full",
                                    day: cn(
                                        buttonVariants({ variant: "ghost" }),
                                        "relative size-9 p-0 font-normal text-[0.9rem] aria-selected:opacity-100 "
                                    ), 
                                    cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20"
                                }}
                            />   
                            <Tabs defaultValue="monthly" className='w-full'>
                                <TabsList className='w-full mb-2'>
                                    <TabsTrigger value="monthly"> Monthly </TabsTrigger>
                                    <TabsTrigger value="daily"> Daily </TabsTrigger>
                                </TabsList> 
                                <TabsContent value="monthly">
                                    <ApptsList 
                                        appts={getApptsByMonth(date, appointments)}
                                        openForm={openForm}
                                        showDate
                                    />   
                                </TabsContent>
                                <TabsContent value="daily"> 
                                    <ApptsList 
                                        appts={getApptsByDate(date, appointments)}
                                        openForm={openForm}
                                    />  
                                </TabsContent>
                            </Tabs>  
                        </div>  
                    </Section> 

                    <FormDialog
                        open={formOpen} 
                        onOpenChange={setFormOpen}
                        title={`${formData.selected === null ? 'Add' : 'Edit'} ${formData.type}`}
                        form={getFormType()}
                    />  
                </div>
            }   
        </div>  
    )
} 