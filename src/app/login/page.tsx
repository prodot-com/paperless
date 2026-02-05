"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const Page = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return (
      <div>
        <button
          onClick={() => signIn("google")}
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  if(session){
    console.log(session)
  }

  return (
    <div>
      <p>Logged in as {session.user?.email}</p>
      <br />
      <button onClick={()=>redirect("/dashboard")}>Go to notes</button>
      <br />
      <button onClick={()=>signOut()}>
        logout
      </button>
    </div>
  );
};

export default Page;
