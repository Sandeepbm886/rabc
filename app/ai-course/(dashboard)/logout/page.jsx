"use client";

import { Button } from '../../../../components/ui/button'
import { SignOutButton, useUser } from '@clerk/nextjs'
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import Image from "next/image";
import UserButtonWrapper from '../_components/UserButtonWrapper';
import UserNameWrapper from '../_components/UserNameWrapper';

export default function LogoutPage() {
  const { user } = useUser();

  return (
    <div className='w-[750px] flex justify-center px-20'>
    <Card className="w-[400px] shadow-xl border border-gray-200">
      <CardHeader className="flex flex-col items-center gap-3">
        <CardTitle className="text-xl font-semibold text-center">
          Confirm Logout
        </CardTitle>
        <UserButtonWrapper/>
        <p className="text-sm text-gray-500">Signed in as {<UserNameWrapper />}</p>
      </CardHeader>
      <CardContent className="flex justify-center">
        <SignOutButton>
          <Button size="lg" className="px-8">Sign Out</Button>
        </SignOutButton>
      </CardContent>
    </Card>
    </div>
  );
}
