import type { AppProps } from "next/app";
import "modern-css-reset/dist/reset.min.css";
import "../styles/global.scss";

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
