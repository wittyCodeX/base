import Head from 'next/head';
import { Suspense } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function BaseLayout({ children }) {
  return (
    <>
      <Head>
        <title>XYXY Base Swap - XYXY Finance</title>
        <meta
          name="description"
          content="BaseSwap is the leading swap platform on Base"
        />
        <meta
          name="keywords"
          content="Defi, Base, Dex, Dex Aggregator, Swap "
        />
        <meta property="og:title" content={`XYXY Base Swap | XYXY Finance`} />
        <meta property="og:type" content="website" />
        <meta
          property="og:description"
          content={`XYXY Base Swap is the Dex aggregator on Base network`}
        />
        <meta property="og:url" content={`https://xyxybase.netlify.app/`} />
        <meta property="og:site_name" content="XYXY Base Swap"></meta>
        <meta
          property="og:image"
          content="https://xyxybase.netlify.app/logo_new.png"
        ></meta>
        <meta property="og:image:type" content="image/png"></meta>
        <meta property="og:image:width" content="2000"></meta>
        <meta property="og:image:height" content="2000"></meta>
        <meta property="og:image:alt" content="Logo"></meta>
      </Head>
      <Header />
      <main className="flex flex-col p-2 ">{children}</main>
      <Footer />
    </>
  );
}
