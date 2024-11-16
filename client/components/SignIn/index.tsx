"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export const SignIn = () => {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  } else {
    return (
      <>
        Not signed in <br />
        <button className='p-3 bg-green-500 rounded-md text-white font-bold' onClick={() => signIn("worldcoin")}>Sign in</button>
      </>
    );
  }
};
