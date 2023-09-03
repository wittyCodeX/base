import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

import { db } from '@/config/firebase';
import { onValue, ref, query } from 'firebase/database';
import { Container, Grid, Typography } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import { convertCurrency } from '@/libs/utils';
const LeaderBoard = () => {
  const [data, setData] = useState();

  useEffect(() => {
    const dbQuery = query(ref(db, 'histories'));

    onValue(dbQuery, (snapshot) => {
      const returned = snapshot.val();

      if (snapshot.exists() && returned) {
        let result = [];
        const values = Object.values(returned);

        values.reduce(function (res, value) {
          if (!res[value.address]) {
            res[value.address] = { address: value.address, newXP: 0 };
            result.push(res[value.address]);
          }
          res[value.address].newXP += Number(value.newXP);
          return res;
        }, {});

        setData(result);
      }
    });
  }, []);

  useEffect(() => {
    const init = async () => {
      const { Modal, Ripple, initTE } = await import('tw-elements');
      initTE({ Modal, Ripple });
    };
    init();
  }, []);

  return (
    <Grid className='page-wrapper'>
      <Head>
        <title>LeaderBoard | XYXY Finance</title>
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
      <Header />
      <Container className="leaderboard-wrapper">
        <Grid container spacing={2}>
          <Grid item xs={12} align="center">
            <Typography variant="h3">Leader Board</Typography>
          </Grid>
          {/* <Grid item xs={12} className="leaderboard-info">
            <div>
              <Typography variant="h6">Top Traders</Typography>
              <Grid item xs={12} className="info-card"></Grid>
            </div>
            <div>
              <Typography variant="h6">Top Traders</Typography>
              <Grid item xs={12} className="info-card">
                {data && data.length > 0
                  ? data.map((item, index) => {
                      if (index > 2) return;
                      return (
                        <div className="info-card-detail" key={index}>
                          <div className="address">{index + 1}</div>
                          <div className="address">
                            {item ? formatAddress(item?.address, 6) : '---'}
                          </div>
                          <div className="newXp">
                            {data && data.length > 0 ? item?.newXP : '---'} XP
                          </div>
                        </div>
                      );
                    })
                  : ''}
              </Grid>
            </div>
            <div>
              <Typography variant="h6">Top Traders</Typography>
              <Grid item xs={12} className="info-card"></Grid>
            </div>
          </Grid> */}
          <Grid item xs={12} align="center">
            <Grid className="grid-wrapper dex-ranking">
              <table
                className="dex-table"
                border="0"
                cellSpacing="0"
                cellPadding="0"
              >
                <thead>
                  <tr>
                    <th style={{ padding: '0.7rem' }}>No</th>
                    <th className="text-center">wallet address</th>
                    <th>XP</th>
                  </tr>
                </thead>

                {data && data.length > 0 ? (
                  <tbody>
                    {data.map((item, index) => {
                      return (
                        <tr
                          key={index}
                          className={index % 2 === 0 ? 'table-hover' : ''}
                        >
                          <td className="p-2">{index + 1}</td>
                          <td className="text-center">{item.address}</td>
                          <td className="up">{convertCurrency(item.newXP)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                ) : (
                  <tbody className="skeleton-table">
                    <tr>
                      <td colSpan={4}>
                        <Skeleton
                          variant="rounded"
                          sx={{ bgcolor: '#2a3454' }}
                          height={40}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={4}>
                        <Skeleton
                          variant="rounded"
                          sx={{ bgcolor: '#2a3454' }}
                          height={40}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={4}>
                        <Skeleton
                          variant="rounded"
                          sx={{ bgcolor: '#2a3454' }}
                          height={40}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={4}>
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

export default LeaderBoard;
