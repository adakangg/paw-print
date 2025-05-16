import { Bird, Cat, Dog, PawPrint, Rabbit, Worm } from "lucide-react";
import { BrushSvg, DogHouseSvg, HeartSvg, LeashSvg, PawprintSvg } from "./components/icons";

export const daysOfWeek = [ "Su", "Mo", "Tu", "We", "Th", "Fr", "Sa" ];

export const PET_AVATAR_OPTIONS = [
    '/default_avatars/cat_1.png', 
    '/default_avatars/cat_2.png', 
    '/default_avatars/dog_1.png',
    '/default_avatars/dog_2.png',
    '/default_avatars/bird.png',
    '/default_avatars/rabbit.png',
    '/default_avatars/snake.png',
    '/default_avatars/pawprint.png'
]

export const SPECIES_ICONS = new Map<string, React.ReactElement<React.SVGProps<SVGSVGElement>>>([
    ['dog', <Dog />], 
    ['cat', <Cat />],
    ['bird', <Bird />],
    ['small_animal', <Rabbit />], 
    ['reptile', <Worm />], 
    ['other', <PawPrint />]
]);

export const PERSONNEL_ICONS = new Map<string, React.ReactElement>([
    ['vet', <HeartSvg className={"fill-black stroke-black"} style={{width:35, height:35}} />], 
    ['grooming', <BrushSvg className={"fill-black stroke-black"} style={{width:35, height:35}} />],
    ['boarding', <DogHouseSvg className={"fill-black stroke-black"} style={{width:35, height:35}} />],
    ['daily', <LeashSvg className={"fill-black stroke-black"} style={{width:35, height:35}} />], 
    ['other', <PawprintSvg className={"fill-black stroke-black"} style={{width:35, height:35}} />],  
]);


export const CHIP_COLORS = ["bg-primary-muted", "bg-primary", "bg-orange-primary", "bg-gray-primary"]

export const COLOR_OPTIONS = [
    {
        bgPrimary: "bg-blue-primary",
        bgMuted: "bg-blue-background",
        bgText: "bg-blue-text",
        borderL: "border-l-blue-primary",
        hoverBorder: "hover:border-blue-primary"
    },
    {
        bgPrimary: "bg-orange-primary",
        bgMuted: "bg-orange-background",
        bgText: "bg-orange-text",
        borderL: "border-l-orange-primary",
        hoverBorder: "hover:border-orange-primary"
    },
    {
        bgPrimary: "bg-pink-primary",
        bgMuted: "bg-pink-background",
        bgText: "bg-pink-text",
        borderL: "border-l-pink-primary",
        hoverBorder: "hover:border-pink-primary"
    },
    {
        bgPrimary: "bg-gray-primary",
        bgMuted: "bg-gray-background",
        bgText: "bg-gray-text",
        borderL: "border-l-gray-primary",
        hoverBorder: "hover:border-gray-primary"
    }
]

export const SITE_ATTRIBUTIONS = [
    { name: 'Roundicons Premium', link: 'https://www.flaticon.com/authors/roundicons-premium' },
    { name: 'welovegraphics', link: 'https://www.flaticon.com/authors/welovegraphics' },
    { name: 'vectorsmarket15', link: 'https://www.flaticon.com/authors/vectorsmarket15' }, 
    { name: 'smashingstocks', link: 'https://www.flaticon.com/authors/smashingstocks' },
    { name: 'Freepik', link: 'https://www.flaticon.com/authors/freepik' }
]