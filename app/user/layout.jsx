import { SidebarProvider, SidebarTrigger } from '../../components/ui/sidebar'
import React from 'react'
import { AppSidebar } from '../_components/app-sidebar'

const layout = ({ childrens }) => {
    return (
        <main>
            <SidebarProvider>
                <AppSidebar />
                <SidebarTrigger/>
                {childrens}
            </SidebarProvider>
        </main>
    )
}

export default layout