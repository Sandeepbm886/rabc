"use client"

import {
    Calendar,
    Home,
    Inbox,
    Search,
    Settings,
    ChevronUp,
    MoreHorizontal,
    User2,
    ChevronDown,
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubItem,
} from "../../components/ui/sidebar"

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "../../components/ui/collapsible"

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "../../components/ui/dropdown-menu"
import { HomeIcon } from "lucide-react"
import { ChevronsUpDown } from "lucide-react"
import { HeartOffIcon } from "lucide-react"

const items = [
    { title: "Home", url: "#", icon: Home },
    { title: "Inbox", url: "#", icon: Inbox },
    { title: "Calendar", url: "#", icon: Calendar },
    { title: "Search", url: "#", icon: Search },
    { title: "Settings", url: "#", icon: Settings },
]

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" >
            {/* HEADER */}
            <SidebarHeader>
                <SidebarMenuButton className="flex items-center gap-2">
                    <HeartOffIcon className="h-5 w-5 text-muted-foreground" />
                    <span className="font-bold">
                        Header
                    </span>
                </SidebarMenuButton>
            </SidebarHeader>


            {/* CONTENT */}
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Platform</SidebarGroupLabel>
                    <SidebarGroupContent>

                        <Collapsible className="group/collapsible">
                            <CollapsibleTrigger asChild>
                                <SidebarMenuButton>
                                    <HomeIcon />
                                    Playground
                                    <ChevronDown className="ml-auto" />
                                </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <SidebarMenuSub>
                                    <SidebarMenuSubItem>
                                        <a href="/ai-course">AiCourse</a>
                                    </SidebarMenuSubItem>
                                    <SidebarMenuSubItem>
                                        <a href="/videocall">Video-Call</a>
                                    </SidebarMenuSubItem>
                                    <SidebarMenuSubItem>
                                        <a href="#">Settings</a>
                                    </SidebarMenuSubItem>
                                </SidebarMenuSub>
                            </CollapsibleContent>
                        </Collapsible>

                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <SidebarMenuAction>
                                                <MoreHorizontal />
                                            </SidebarMenuAction>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent side="right" align="start">
                                            <DropdownMenuItem>Edit</DropdownMenuItem>
                                            <DropdownMenuItem>Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            {/* FOOTER */}
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton>
                                    <User2 /> Username
                                    <ChevronsUpDown className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                align="center"
                                className="w-full min-w-[180px] bg-sidebar p-1 shadow-lg border border-border"
                            >
                                <DropdownMenuItem className="w-full justify-start">
                                    <span>Account</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="w-full justify-start">
                                    <span>Billing</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="w-full justify-start">
                                    <span>Sign out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>

                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
