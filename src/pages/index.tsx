import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Layout from "~/components/Layout";
import JobsPage from "~/components/jobs/JobsPage";

import { api } from "~/utils/api";

export default function Home()
{
  // const hello = api.post.hello.useQuery({ text: "from tRPC" });
  const { data: sessionData, status } = useSession();
  const router = useRouter();
  console.log(sessionData);
  if (status === 'unauthenticated')
  {
    void router.push('/signin');
  }
  console.log(status);
  return (
    <>
      <Head>
        <title>ورشتي</title>
        <meta name="description" content="ورشتي هي منظومة لمتابعة أعمال ورش الصيانة." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout >
        <JobsPage />
      </Layout>
      {/* <main className=" flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">

      </main> */}
    </>
  );
}

// function AuthShowcase() {
//   const { data: sessionData } = useSession();

//   const { data: secretMessage } = api.post.getSecretMessage.useQuery(
//     undefined, // no input
//     { enabled: sessionData?.user !== undefined }
//   );

//   return (
//     <div className="flex flex-col items-center justify-center gap-4">
//       <p className="text-center text-2xl text-white">
//         {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
//         {secretMessage && <span> - {secretMessage}</span>}
//       </p>
//       <button
//         className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
//         onClick={sessionData ? () => void signOut() : () => void signIn()}
//       >
//         {sessionData ? "Sign out" : "Sign in"}
//       </button>
//     </div>
//   );
// }
