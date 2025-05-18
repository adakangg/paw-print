'use client'
import Image from "next/image"; 
import Link from "next/link"
import { redirect } from 'next/navigation'; 
import { useTheme } from "next-themes"
import { logout } from '../auth/logout/actions'; 
import { useUserProfile } from "@/hooks/useUser"; 
import { Button } from "@/components/ui/button";   
import {
    DropdownMenu,
    DropdownMenuContent, 
    DropdownMenuItem,  
    DropdownMenuLabel,  
    DropdownMenuSeparator,  
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Folder, Home, LogOut, PawPrint, SunMoon } from "lucide-react"

function TextMenuItem({ text, link }: { text: string; link: string }) {
    return (
        <Link href={{ pathname: link }}>
            <div className="hover:border-b-1 hover:border-b-primary"> {text} </div>
        </Link>
    )
}

function ImgMenuItem({ iconBtn, link }: { iconBtn: React.ReactElement; link: string }) {
    return (
        <Link href={{ pathname: link }}> {iconBtn} </Link>
    )
}

export default function DashboardLayout({ children } : { children: React.ReactNode }) { 
    const { data: user, isError: userError } = useUserProfile()     
    if (userError) redirect('/error')  
    const { theme, setTheme } = useTheme() 
    const toggleTheme = () => { setTheme(theme === 'dark' ? 'light' : 'dark') }

    return (
        <div className="flex-col-center">    
            <div className="fixed z-10 top-0 left-0 flex-row-between bg-topbar px-5 py-3" >
                <div className="flex-row-center gap-2">
                    <Image src='/paw-print.png' alt="pawprint" width={28} height={28} /> 
                    <span className="max-[650px]:hidden text-[1.5rem] text-white font-semibold">pawprint</span>

                    <div className="max-[650px]:hidden w-fit flex-row-center gap-8 pt-1 text-[1rem] text-white ml-8">
                        <TextMenuItem text="Dashboard" link="/dashboard" />
                        <TextMenuItem text="All Pets" link="/dashboard/pets" />
                        <TextMenuItem text="Archives" link="/dashboard/archives" /> 
                    </div>

                    <div className="min-[650px]:hidden w-fit flex-row-center gap-4 pt-1 text-[1rem] text-white ml-3">
                        <ImgMenuItem 
                            iconBtn={
                                <Button variant="outline" size="icon" onClick={toggleTheme} className='border-muted-background'>
                                    <Home className="h-[2rem] w-[2rem] text-muted-foreground" />
                                </Button>
                            } 
                            link="/dashboard" 
                        /> 
                        <ImgMenuItem 
                            iconBtn={
                                <Button variant="outline" size="icon" onClick={toggleTheme} className='border-muted-background'>
                                    <PawPrint className="h-[2rem] w-[2rem] text-muted-foreground" />
                                </Button>
                            } 
                            link="/dashboard/pets" 
                        /> 
                         <ImgMenuItem 
                            iconBtn={
                                <Button variant="outline" size="icon" onClick={toggleTheme} className='border-muted-background'>
                                    <Folder className="h-[2rem] w-[2rem] text-muted-foreground" />
                                </Button>
                            } 
                            link="/dashboard/archives" 
                        /> 
                    </div>
                </div>   

                <div className="flex-row-center justify-end gap-5" >   
                    <Button variant="outline" size="icon" onClick={toggleTheme} className='border-muted-background'>
                        <SunMoon className="h-[2rem] w-[2rem] text-muted-foreground"/>
                    </Button> 
                    <Button variant="outline" size="icon" onClick={logout} className='border-muted-background'>
                        <LogOut className="h-[2rem] w-[2rem] text-muted-foreground" />
                    </Button>  
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            { user ? ( 
                                <div className="flex-col-center size-10 bg-primary text-[1.1rem] text-white font-semibold rounded-full hover:border hover:border-white hover:cursor-pointer">
                                    {user.f_name[0]}
                                </div>
                            ) : (
                                <Image src='/user.png' alt='user' width={38} height={38} />
                            )} 
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-fit border-muted-background mr-2">   
                            <DropdownMenuLabel>
                                {`${user?.f_name} ${user?.l_name ?? ""}`}
                                <br/>
                                {user?.email}
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />


                            <DropdownMenuItem className="pr-14" onClick={logout}>
                                <LogOut />
                                Log Out 
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    
                </div> 
            </div>  
            <div className="w-full mt-15">
                {children}  
            </div>
        </div>
    )
}