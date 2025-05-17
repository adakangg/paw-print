import React from 'react';  
import Image from 'next/image';
import { cn } from "@/lib/utils"

export function Avatar({ 
    src, 
    alt,
    className
}: { 
    src: string;
    alt: string;
    className: string;
}) {   
    return ( 
        <div className={cn("relative rounded-full overflow-hidden", className)}>
            <Image src={src} alt={alt} fill />    
        </div> 
    );
} 