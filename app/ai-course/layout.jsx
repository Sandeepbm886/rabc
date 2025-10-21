import React from 'react'
import { SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar"

import { AppSidebar } from '../_components/app-sidebar'

const layout = ({ children }) => {
  return (
    
      
      <main>
        
        {children}
      </main>
    
  )
}

export default layout