"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export const SignIn = () => {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        Signed in as {session?.user?.name?.slice(0, 10)} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  } else {
    return (
      <>
        Not signed in <br />
        <button className='p-3 bg-green-500 rounded-md text-white font-bold' onClick={() => signIn()}>Sign in</button>
      </>
    );
  }
};
