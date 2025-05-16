'use client' 
import React from 'react';  
import { cn } from "@/lib/utils"

export function BorderedImage({ 
    img, 
    className
}: { 
    img: React.ReactNode, 
    className?: string,  
}) {   
    return ( 
        <div>
            <div className='w-fit rounded-[0.2rem] border border-foreground bg-image-background px-4 absolute z-10'>
                {img}
            </div>
            <div className={cn('w-94 h-86 bg-primary rounded-[0.2rem] relative left-2 top-2', className)} />
        </div> 
    );
} 

export function BorderedImageText({ 
    img, 
    className, 
    title,
    subtitle,
    onClick
}: { 
    img: React.ReactNode, 
    className?: string, 
    title?: string,
    subtitle?: string,
    onClick?: () => void
}) {   
    return ( 
        <div className='flex-col-start min-[1000px]:flex-row-center gap-8'>  
        <BorderedImage img={img} className={className} /> 
            { title &&
                <div className='flex-col-center gap-4'>
                    <p className='w-fit h-fit px-4 text-[2.8rem] font-semibold bg-foreground text-background rounded-lg whitespace-pre-line'>
                        {title}
                    </p>
                    <p onClick={onClick} className='hover:underline cursor-pointer'>
                        {subtitle}
                    </p>
                </div> 
            } 
        </div>
    );
}  