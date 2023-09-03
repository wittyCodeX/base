import React, { useState, useEffect } from 'react';
import Head from 'next/head';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Container, Grid, Typography } from '@mui/material';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TVL from '@/components/TVL';
import Skeleton from '@mui/material/Skeleton';

import moment from 'moment';
import defaultImg from '@/assets/erc20.png';

const Stats = () => {
  const [TVLhistory, setTVLhistory] = useState([]);
  const [dexTVLData, setDexTVLData] = useState([]);

  const getTVL = async (protocol) => {
    const response = await fetch(
      `/api-llama/v2/historicalChainTvl/${protocol}`
    );
    const result = await response.json();
    setTVLhistory(result);
  };

  const getDexTVL = async (protocol) => {
    const response = await fetch(`/api-llama/overview/dexs/${protocol}`);
    const result = await response.json();
    let tvlList = [];
    for (let i = 0; i < result.protocols.length; i++) {
      const res = await fetch(`/api-llama/tvl/${result.protocols[i].module}`);
      const tvl = await res.json();
      if (tvl && !tvl.message) {
        const data = {
          logo: result.protocols[i].logo,
          displayName: result.protocols[i].displayName,
          change_1d: result.protocols[i].change_1d,
          change_7d: result.protocols[i].change_7d,
          change_1m: result.protocols[i].change_1m,
          tvl: Number(tvl) !== NaN ? tvl : 0,
        };
        tvlList.push(data);
      }
    }
    const dexList = tvlList.sort((a, b) => {
      return b.tvl - a.tvl;
    });
    console.log(dexList);
    setDexTVLData(dexList);
  };
  const addDefaultImg = (e, img) => {
    console.log(img);
    const extension = img.slice(-3);
    console.log(extension);
    let img_src =
      extension === 'png' ? img.slice(0, -3) + 'jpg' : defaultImg.src;
    e.target.src = img_src;
  };
  const convertCurrency = (labelValue) => {
    return Number(labelValue) >= 1.0e9
      ? (Number(labelValue) / 1.0e9).toFixed(2) + 'B'
      : Number(labelValue) >= 1.0e6
        ? (Number(labelValue) / 1.0e6).toFixed(2) + 'M'
        : Number(labelValue) >= 1.0e3
          ? (Number(labelValue) / 1.0e3).toFixed(2) + 'K'
          : Number(labelValue).toFixed(2);
  };

  const dateFormatter = (time) => {
    var d = new Date(0);
    d.setUTCSeconds(time);
    return moment(d).format('DD/MM');
  };

  const calcChange = () => {
    return (
      1 -
      Number(TVLhistory[TVLhistory.length - 2].tvl) /
      Number(TVLhistory[TVLhistory.length - 1].tvl)
    ).toFixed(3);
  };

  useEffect(() => {
    getTVL('base');
    getDexTVL('base');
  }, []);
  return (
    <Grid className='page-wrapper'>
      <Header />
      <Head>
        <title>Stats | XYXY Finance</title>
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
      <Container className="content-wrapper">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h3">Base Stats</Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Grid container direction={'column'}>
              <Grid className="grid-wrapper">
                <Typography variant="h6">TVL (USD)</Typography>
                <Typography variant="h4">
                  {TVLhistory.length ? (
                    <>
                      ${convertCurrency(TVLhistory[TVLhistory.length - 1].tvl)}
                    </>
                  ) : (
                    <Skeleton variant="rounded" sx={{ bgcolor: '#2a3454' }} />
                  )}
                </Typography>
              </Grid>

              <Grid className="grid-wrapper">
                <Typography variant="h6">Change (24h)</Typography>
                {TVLhistory.length ? (
                  <Typography
                    variant="h4"
                    className={calcChange() < 0 ? 'down' : 'up'}
                  >
                    {calcChange()}%
                  </Typography>
                ) : (
                  <Typography variant="h4">
                    <Skeleton variant="rounded" sx={{ bgcolor: '#2a3454' }} />
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={9}>
            <Grid className="grid-wrapper">
              {TVLhistory.length ? (
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart
                    width={500}
                    height={200}
                    data={TVLhistory}
                    syncId="anyId"
                    margin={{
                      top: 0,
                      right: 5,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <XAxis
                      dataKey="date"
                      tickFormatter={dateFormatter}
                      tick={{ fill: 'white' }}
                      tickLine={{ stroke: 'white' }}
                    />
                    <YAxis
                      tickFormatter={convertCurrency}
                      orientation="right"
                      tick={{ fill: 'white' }}
                      tickLine={{ stroke: 'white' }}
                    />
                    <Tooltip
                      formatter={convertCurrency}
                      labelFormatter={dateFormatter}
                    />
                    <Area
                      type="monotone"
                      dataKey="tvl"
                      stroke="#279778"
                      fill="#234b56"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <Skeleton
                  variant="rounded"
                  sx={{ bgcolor: '#2a3454' }}
                  height={200}
                />
              )}
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6">TVL Rankings</Typography>
            <Grid className="grid-wrapper dex-ranking">
              <table
                className="dex-table"
                border="0"
                cellSpacing="0"
                cellPadding="0"
              >
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Name</th>
                    <th>1D change</th>
                    <th>1w change</th>
                    <th>1m change</th>
                    <th>TVL</th>
                  </tr>
                </thead>

                {dexTVLData.length > 0 ? (
                  <tbody>
                    {dexTVLData.map((data, index) => {
                      return (
                        <tr
                          key={index}
                          className={index % 2 === 0 ? 'table-hover' : ''}
                        >
                          <td>{index + 1}</td>
                          <td className="dex-name">
                            <img
                              src={data.logo}
                              alt="dex icon"
                              className="dex-icon"
                              onError={(e) => addDefaultImg(e, data.logo)}
                            />
                            {data.displayName}
                          </td>
                          <td className={data.change_1d > 0 ? 'up' : 'down'}>
                            $ {convertCurrency(data.change_1d)}
                          </td>
                          <td className={data.change_7d > 0 ? 'up' : 'down'}>
                            $ {convertCurrency(data.change_7d)}
                          </td>
                          <td className={data.change_1m > 0 ? 'up' : 'down'}>
                            $ {convertCurrency(data.change_1m)}
                          </td>
                          <td>$ {convertCurrency(data.tvl)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                ) : (
                  <tbody className="skeleton-table">
                    <tr>
                      <td colSpan={6}>
                        <Skeleton
                          variant="rounded"
                          sx={{ bgcolor: '#2a3454' }}
                          height={40}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={6}>
                        <Skeleton
                          variant="rounded"
                          sx={{ bgcolor: '#2a3454' }}
                          height={40}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={6}>
                        <Skeleton
                          variant="rounded"
                          sx={{ bgcolor: '#2a3454' }}
                          height={40}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={6}>
                        <Skeleton
                          variant="rounded"
                          sx={{ bgcolor: '#2a3454' }}
                          height={40}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={6}>
                        <Skeleton
                          variant="rounded"
                          sx={{ bgcolor: '#2a3454' }}
                          height={40}
                        />
                      </td>
                    </tr>
                  </tbody>
                )}
              </table>
            </Grid>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </Grid>
  );
};

export default Stats;
