import React from 'react'
import StreamVideoProvider from '../providers/StreamClientProvider';
export const metadata = {
  title: "YOOM",
  description: "Video calling App",
  icons: {
    icon: "/icons/logo.svg",
  },
};
function RootLayout({children}) {
  return (
    <main>
        <StreamVideoProvider>
        {children}
        </StreamVideoProvider>
    </main>
  )
}

export default RootLayout