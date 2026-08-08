import * as React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { CacheProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { Toaster } from "react-hot-toast";
import createEmotionCache from "../createEmotionCache";
import theme from "../theme";
import GlobalStyles from "../styles/GlobalStyles";
import Layout from "../components/Layout";
import { PlayerProvider } from "../context/PlayerContext";
import AuthProvider from "../context/AuthContext";

const PersistentPlayer = dynamic(() => import("../components/Player"), { ssr: false });
const clientSideEmotionCache = createEmotionCache();

export default function MyApp({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
}) {
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Karrma&apos;s Heart</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <meta
          name="description"
          content="Karrma's Heart — independent music, artist stories, and sound with a soul."
        />
        <meta name="theme-color" content="#09090B" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles />
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              success: {
                style: {
                  background: "#191719",
                  color: "#F7F3EC",
                  border: "1px solid rgba(213,168,90,.45)",
                  borderRadius: "14px",
                },
              },
              error: {
                style: {
                  background: "#2A1215",
                  color: "#FFD8DB",
                  border: "1px solid rgba(255,120,132,.35)",
                  borderRadius: "14px",
                },
              },
            }}
          />
          <PlayerProvider>
            <Layout>
              <Component {...pageProps} />
              <PersistentPlayer />
            </Layout>
          </PlayerProvider>
        </AuthProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}
