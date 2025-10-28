import React from 'react'
import StreamVideoProvider from '../providers/StreamClientProvider';

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