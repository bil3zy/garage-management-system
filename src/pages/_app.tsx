import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { Inter, Mirza } from "next/font/google";

import { api } from "~/utils/api";

import "~/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});
const mirza = Mirza({ weight: '500', subsets: ['arabic'] });

const MyApp: AppType<{ session: Session | null; }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) =>
{
  return (
    <SessionProvider session={ session }>
      <main dir="rtl" className={ `text-primary  ${mirza.className}` }>
        <Component { ...pageProps } />
      </main>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
