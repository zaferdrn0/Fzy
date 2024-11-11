import { AuthProvider } from "@/context/AuthContext";
//import Header from "@/layout/Header";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      {/* <Header /> */}
      <Component {...pageProps} />
    </AuthProvider>
  )


}
