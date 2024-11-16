import Sidebar from "@/components/Sidebar";
import { AuthProvider } from "@/context/AuthContext";
import { menuItems } from "@/navbar/navbarMenu";
//import Header from "@/layout/Header";
import "@/styles/globals.css";
import theme from "@/theme";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import type { AppProps } from "next/app";


export default function App({ Component, pageProps }: AppProps) {

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
    <Box sx={{ display: 'flex' }}>
    <Sidebar menuItems={menuItems} />
        <Box sx={{ flexGrow: 1 ,m:2}}>
          <Component {...pageProps} />
        </Box>
      </Box>
    </ThemeProvider>
  )


}
