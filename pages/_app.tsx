import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import Script from "next/script";

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<title>System Status</title>
			</Head>
			<Script strategy="beforeInteractive" src="/env.js"></Script>		
			<Component {...pageProps} />
		</>
	);
}

export default MyApp;
