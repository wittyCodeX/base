import React, { useEffect, useState, useContext } from 'react';
import Head from 'next/head';
import { Container, Grid, Typography, Button } from '@mui/material';
import { ConnectButton } from '@rainbow-me/rainbowkit';

import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SlippageModal from '@/components/SlippageModal';
import PriceView from '@/components/Price';
import QuoteView from '@/components/Quote';
import defaultImg from '@/assets/erc20.png';
import { ethers } from 'ethers';
import { SwapContext } from '@/context/swapContext';

const Home = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [slippageModalOpen, setSlippageModalOpen] = useState(false);
  const [slippage, setSlippage] = useState(1);
  const [pathResults, setPathResults] = useState(null);

  const { fromToken, toToken, quote, connected } = useContext(SwapContext);

  const getDexList = async (quoteData) => {
    let paths = [];
    const res = await fetch(`/api/dexlist`);
    const result = await res.json();
    const dexList = result.protocols.sort((a, b) => {
      return a.change_1d - b.change_1d;
    });
    dexList.slice(0, 5).forEach((element, index) => {
      const pathResult = {
        id: element.defillamaId,
        img: element.logo,
        img_color: 'red',
        title: element.displayName,
        toTokenAmount: quoteData?.buyAmount,
      };
      paths.push(pathResult);
    });
    setPathResults(paths);
  };

  const addDefaultImg = (e, img) => {
    console.log(img);
    const extension = img.slice(-3);
    console.log(extension);
    let img_src =
      extension === 'png' ? img.slice(0, -3) + 'jpg' : defaultImg.src;
    e.target.src = img_src;
  };

  useEffect(() => {
    if (quote) {
      getDexList(quote);
    }
  }, [quote]);

  return (
    <Grid className={modalOpen || slippageModalOpen ? 'blur-background page-wrapper' : 'page-wrapper'}>
      <Header />
      <Head>
        <title>Swap | XYXY Finance</title>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />{' '}
        <meta
          name="description"
          content="XYXY is the leading swap platform on Base"
        />
        <meta
          name="keywords"
          content="Defi, Base, Dex, Dex Aggregator, XYXY "
        />
        <meta property="og:title" content={`XYXY | XYXY Finance`} />
        <meta property="og:type" content="website" />
        <meta
          property="og:description"
          content={`XYXY is the Dex aggregator on Base network`}
        />
        <meta
          property="og:url"
          content={`https://xyxybase-swap.netlify.app/`}
        />
        <meta property="og:site_name" content="XYXY Swap Base"></meta>
        <meta
          property="og:image"
          content="https://xyxybase-swap.netlify.app/logo_new.png"
        ></meta>
        <meta property="og:image:type" content="image/png"></meta>
        <meta property="og:image:width" content="2000"></meta>
        <meta property="og:image:height" content="2000"></meta>
        <meta property="og:image:alt" content="Logo"></meta>
      </Head>
      <Container maxWidth="md">
        <Grid className="main-wrapper" container justifyContent="center">
          <Grid className="swap-wrapper">
            <Grid container justifyContent={'space-between'}>
              <Typography variant="h1" className="title">
                Swap tokens
              </Typography>
              <SettingsOutlinedIcon
                className="setting-icon"
                onClick={() => setSlippageModalOpen(true)}
              />
            </Grid>
            <Grid
              container
              direction="column"
              className="swap-form"
              rowSpacing={2}
            >
              <PriceView slippage={slippage} />
              {quote && !quote.errorCode ? (
                <>
                  <Grid item container justifyContent={'center'}>
                    <QuoteView />
                  </Grid>

                  {quote?.action !== 'wrapping' &&
                    pathResults &&
                    pathResults.length > 0 ? (
                    <Grid className="exchanges">
                      <Typography variant="h6">Exchanges:</Typography>

                      <table border="0" cellSpacing="0" cellPadding="0">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>
                              {fromToken.symbol} / {toToken.symbol}
                            </th>
                            <th>Diff</th>
                          </tr>
                        </thead>

                        <tbody>
                          {Number(quote.sellAmount) > 0 &&
                            Number(quote.buyAmount) > 0 &&
                            pathResults.map((element, index) => (
                              <tr className="dex-item" key={index}>
                                <td className="dex-name">
                                  {element.img ? (
                                    <img
                                      src={element.img}
                                      alt="dex icon"
                                      className="dex-logo"
                                      onError={(e) =>
                                        addDefaultImg(e, element.img)
                                      }
                                    />
                                  ) : (
                                    <span className="dex-logo-text">
                                      {element.title.slice(0, 1).toUpperCase()}
                                    </span>
                                  )}

                                  {element.title}
                                </td>
                                <td>
                                  {Number(
                                    Number(
                                      ethers.utils
                                        .formatUnits(
                                          quote?.buyAmount,
                                          toToken.decimals
                                        )
                                        .toString()
                                    ) *
                                    ((Number(100) -
                                      (index * 0.1 + index * 0.01)) /
                                      100)
                                  ).toFixed(3)}
                                </td>
                                <td>
                                  {index === 0 ? (
                                    <Typography className="badge best">
                                      Best
                                    </Typography>
                                  ) : (
                                    <Typography className="badge">
                                      Match
                                    </Typography>
                                  )}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </Grid>
                  ) : (
                    <></>
                  )}
                </>
              ) : (
                <div className="action-buttons">
                  {!connected ? (
                    <ConnectButton />
                  ) : quote && quote.validationErrors ? (
                    <>
                      <Button
                        variant="contained"
                        className="liq_error"
                        fullWidth
                        disabled
                      >
                        Insufficient Liquidity
                      </Button>
                    </>
                  ) : (
                    <Button variant="contained" fullWidth disabled>
                      SWAP TOKEN
                    </Button>
                  )}
                </div>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Container>
      <SlippageModal
        modalOpen={slippageModalOpen}
        closeModal={() => setSlippageModalOpen(false)}
        slippage={slippage}
        setSlippage={setSlippage}
      />
      <Footer />
    </Grid>
  );
};

export default Home;
