import { LayoutDashboardIcon } from "lucide-react";
import { CalendarClock } from "lucide-react";
import { CalendarArrowDownIcon } from "lucide-react";
import { VideoIcon } from "lucide-react";
import { HousePlus } from "lucide-react";
import { HomeIcon } from "lucide-react";


export const sidebarLinks=[
    {
        label:'Home',
        route:'/ai-course',
        imgUrl:<HomeIcon/>
    },
    {
        label:'Dashboard',
        route:'/videocall',
        imgUrl:<LayoutDashboardIcon/>
    },
    {
        label:'Upcoming',
        route:'/videocall/upcoming',
        imgUrl:<CalendarClock/>
    },
    {
        label:'Previous',
        route:'/videocall/previous',
        imgUrl:<CalendarArrowDownIcon/>
    },
    {
        label:'Recordings',
        route:'/videocall/recordings',
        imgUrl:<VideoIcon/>
    },
    {
        label:'Personal Room',
        route:'/videocall/personal-room',
        imgUrl:<HousePlus/>
    },
]
export const avatarImages = [
  '/images/avatar-1.jpeg',
  '/images/avatar-2.jpeg',
  '/images/avatar-3.png',
  '/images/avatar-4.png',
  '/images/avatar-5.png',
];