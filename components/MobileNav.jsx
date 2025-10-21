"use client"
import React from 'react'
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "../components/ui/sheet"
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '../lib/utils'
import { sidebarLinks } from '../app/videocall/constants'
function MobileNav() {
    const pathname = usePathname();
    return (
        <section >
            <Sheet>
                <SheetTrigger asChild>
                    <Image src="/icons/hamburger.svg" alt='Hamburger Menu' width={36} height={36} className='cursor-pointer sm:hidden' />
                </SheetTrigger>
                <SheetContent side='left' className='border-none bg-darkone w-[50vw] max-w-xs p-0'>
                    <SheetHeader>
                        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                    </SheetHeader>
                    <Link href="/" className='flex items-center gap-1'>
                        <Image src="/icons/logo.svg" alt='Logo' width={32} height={32} className='mac-sm:size-10'></Image>
                        <p className='text-[26px] font-extrabold text-white '>VC</p>
                    </Link>
                    <div className='flex h-[calc(100vh-72px)] flex-col justify-between overflow-y-auto'>
                        <section className='flex h-full flex-col gap-6 pt-16 text-white'>
                            {sidebarLinks.map((link) => {
                                const isActive = pathname === link.route||pathname.startsWith(`${link.route}/`);
                                return (
                                    <SheetClose key={link.route} asChild>
                                        <Link href={link.route} key={link.label} className={cn('flex gap-4 items-center p-4 rounded-lg w-full max-w-60', { 'bg-blue-500': isActive })}>
                                            <Image src={link.imgUrl} alt={link.label} width={20} height={20} />
                                            <p className='font-semibold '>{link.label}</p>
                                        </Link>
                                    </SheetClose>
                                )
                            })}
                        </section>
                    </div>
                </SheetContent>
            </Sheet>
        </section>
    )
}

export default MobileNav