import React from 'react'
import {  SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from '../_components/app-sidebar'



const layout = ({ children }) => {
    return (
        <SidebarProvider>
            <AppSidebar/>
            <main>
                <SidebarTrigger />
                {children}
            </main>
        </SidebarProvider>
    )
}

export default layout