import "rc-slider/assets/index.css";
import "../styles/antd-style.less";
import "../styles/main.scss";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import { ReactElement, ReactNode, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { DefaultSeo } from "next-seo";
import SEO from "../next-seo.config";
import { ThemeProvider } from "next-themes";
import { Provider } from "react-redux";
// import dynamic from "next/dynamic";
import store from "@/common/redux/store";
import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import { AuthProvider } from "@/common/hooks/useAuth";
// import { MoralisProvider } from "react-moralis";
import Layout from "@/common/components/Layout";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
  theme?: string;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);

  const [mounted, setMounted] = useState(false);

  // When mounted on client, now we can show the UI
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <>
      <Head>
        <title>Bounty Task</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <meta name="description" content="Bounty Task" />
      </Head>
      <AuthProvider>
        {/* <MoralisProvider appId={process.env.NEXT_PUBLIC_APP_ID} serverUrl={process.env.NEXT_PUBLIC_SERVER_URL}> */}
          <Provider store={store}>
            <ThemeProvider defaultTheme="light" enableSystem={false} attribute="class" forcedTheme={Component.theme || null}>
              <DefaultSeo {...SEO} />
              {/* <TopProgressBar /> */}
              <MantineProvider
                withGlobalStyles
                // withNormalizeCSS
                theme={{
                  // colorScheme: "dark",
                  // fontFamily: '"Inter", Helvetica, "Open Sans", sans-serif',
                  colors: {
                    brand: ["#E5E5F7", "#C1BFF1", "#9895F3", "#6B66FF", "#5A55EC", "#4F4AD7", "#4642C2", "#4845A5", "#6B66FF", "#484678"],
                  },
                  primaryColor: "brand",
                }}
              >
                <Layout>{getLayout(<Component {...pageProps} />)}</Layout>
              </MantineProvider>

              {/* ToastContainer */}
              <Toaster position="top-center" reverseOrder={false} />
            </ThemeProvider>
          </Provider>
        {/* </MoralisProvider> */}
      </AuthProvider>
    </>
  );
}

export default MyApp;
