import Sidebar from "@/components/Sidebar";
import { AuthProvider } from "@/context/AuthContext";
import { menuItems } from "@/navbar/navbarMenu";
import "@/styles/globals.css";
import theme from "@/theme";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import type { AppProps } from "next/app";
import { ReactElement, ReactNode } from "react";
import { NextPage } from "next";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Sidebar */}
      <Box className="sidebar" sx={{ flexShrink: 0 }}>
        <Sidebar menuItems={menuItems} />
      </Box>
      {/* Content */}
      <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2 }}>
        {page}
      </Box>
    </Box>
  ));

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {getLayout(<Component {...pageProps} />)}
      </ThemeProvider>
    </AuthProvider>
  );
}
