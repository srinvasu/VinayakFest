import "bootstrap/dist/css/bootstrap.min.css";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="stylesheet" href="/css/styles.css" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
export default MyApp;
