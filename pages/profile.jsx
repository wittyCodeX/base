import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Container, Grid, Typography } from '@mui/material';
import { toReadableAmount } from '@/libs/utils';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

import Skeleton from '@mui/material/Skeleton';
import { useAccount } from 'wagmi';
import { NFT_API_KEY, COVALENTHQ_API } from '@/config/config';
import moment from 'moment';
import { QRCode } from 'react-qrcode-logo';
import defaultImg from '@/assets/erc20.png';

const Profile = () => {
  const [nftList, setNFTLists] = useState();
  const [tokenList, setTokenList] = useState();
  const [mainBalance, setMainBalance] = useState(0);
  const [tokenValue, setTokenValue] = useState(0);
  const { address } = useAccount();
  const [type, setType] = useState('token');

  // const getNFTList = async (addr) => {
  //   const options = {
  //     method: 'GET',
  //     headers: {
  //       accept: 'application/json',
  //       'X-API-Key': NFT_API_KEY,
  //     },
  //   };

  //   fetch(`/mnemonichq/wallets/v1beta1/${addr}/nfts?chains=CHAIN_BASE`, options)
  //     .then((response) => response.json())
  //     .then((response) => {
  //       setNFTLists(response);
  //       console.log(response);
  //     })
  //     .catch((err) => console.error(err));
  // };

  const getBalances = (addr) => {
    let headers = new Headers();
    headers.set('Authorization', `Bearer ${COVALENTHQ_API}`);

    fetch(
      'https://api.covalenthq.com/v1/base-mainnet/address/0x600bE5FcB9338BC3938e4790EFBeAaa4F77D6893/balances_v2/?no-spam=true',
      { method: 'GET', headers: headers }
    )
      .then((resp) => resp.json())
      .then((data) => {
        if (data.data && data.data.items) {
          const res = data.data.items;
          console.log(res);
          const mainToken = res.filter((item) => item.native_token === true);
          setMainBalance(mainToken[0]);
          const erc20Tokens = res.filter(
            (item) =>
              item.supports_erc !== null && item.supports_erc[0] === 'erc20'
          );
          let tokenValue = 0;
          erc20Tokens.forEach((erc20Token) => {
            tokenValue += Number(
              toReadableAmount(erc20Token.balance, erc20Token.contract_decimals)
            );
          });
          setTokenList(erc20Tokens);
          setTokenValue(tokenValue);

          const nftTokens = res.filter(
            (item) =>
              item.supports_erc !== null &&
              (item.supports_erc[0] === 'erc721' ||
                item.supports_erc[0] === 'erc1155')
          );
          setNFTLists(nftTokens);

          console.log(data.data?.items);
        }
      })
      .catch((err) => console.error(err));
  };
  const addDefaultImg = (e) => {
    e.target.src = defaultImg.src;
  };
  // const formatUrl = async (url) => {
  //   console.log(url);
  //   const imgUri = url.split('/');
  //   let headers = new Headers();
  //   headers.set('Authorization', `Bearer ${COVALENTHQ_API}`);

  //   const res = await fetch(
  //     'https://logos.covalenthq.com/tokens/' + imgUri[imgUri.length - 1],
  //     {
  //       method: 'GET',
  //       headers: headers,
  //     }
  //   );
  //   const data = await res.json();
  //   console.log(`Bearer ${COVALENTHQ_API}`);
  //   return data;
  // };
  useEffect(() => {
    if (address) {
      // getNFTList(address);
      getBalances(address);
    }
  }, [address]);

  console.log(tokenList);
  return (
    <Grid className='page-wrapper'>
      <Header />
      <Head>
        <title>Profile | XYXY Finance</title>
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
      <div className="profile">
        <div spacing={2} className="default-container page-layout">
          <div spacing={2} className="profile-wrapper">
            <div className="profile-card">
              <div className="profile-card-info">
                <div className="profile-image-container">
                  <QRCode value={address} />
                </div>

                <div className="profile-card-info-content">
                  <div className="profile-card-info-content-title">
                    <h1>{address}</h1>
                  </div>
                  <div className="profile-card-info-content-para">
                    Ether Balance:{' '}
                    {mainBalance.balance
                      ? toReadableAmount(mainBalance.balance)
                      : '0'}{' '}
                    ETH{' '}
                  </div>
                  <div className="profile-card-info-content-para">
                    Ether Value:{' '}
                    {`${mainBalance.pretty_quote ? mainBalance.pretty_quote : '0'
                      }`}
                  </div>
                  <div className="profile-card-info-content-para">
                    Token Value: $ <span className="up">{tokenValue}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="profile-cards">
              <div className="profile-cards-left">
                <div className="profile-card">
                  <div className="tap-blocks">
                    <button
                      className={
                        type === 'token'
                          ? 'tap-option muted active'
                          : 'tap-option muted'
                      }
                      onClick={() => setType('token')}
                    >
                      Tokens
                    </button>
                    <button
                      className={
                        type === 'nft'
                          ? 'tap-option muted active'
                          : 'tap-option muted'
                      }
                      onClick={() => setType('nft')}
                    >
                      NFTs
                    </button>
                    <div></div>
                  </div>
                  <div className="profile-card-progress">
                    {type === 'token' ? (
                      <table className="profile-tokenlist-table">
                        <tbody>
                          {tokenList && tokenList.length > 0 ? (
                            tokenList.map((item, index) => (
                              <tr key={index}>
                                <td>
                                  {' '}
                                  <img
                                    src={item.logo_url}
                                    alt="Token logo"
                                    style={{ width: '40px', height: '40px' }}
                                    onError={(e) => addDefaultImg(e)}
                                  />
                                </td>
                                <td>
                                  {' '}
                                  <h1>
                                    {item.contract_ticker_symbol}
                                    {` (${item.contract_name})`}
                                  </h1>
                                </td>
                                <td>
                                  {' '}
                                  <h1>
                                    <a
                                      href={`https://basescan.org/address/${item.contract_address}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {item.contract_address}
                                    </a>
                                  </h1>
                                </td>
                                <td>
                                  {' '}
                                  <p>
                                    {toReadableAmount(
                                      item.balance,
                                      item.contract_decimals
                                    )}{' '}
                                    {item.contract_ticker_symbol}
                                  </p>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <></>
                          )}
                        </tbody>
                      </table>
                    ) : (
                      <table className="profile-card-progress-info">
                        <tbody>
                          {nftList && nftList.length > 0 ? (
                            nftList.map((item, index) => (
                              <tr key={index}>
                                <td>
                                  {' '}
                                  <img
                                    src={item.logo_url}
                                    alt="Token logo"
                                    className="token-icon"
                                    onError={(e) => addDefaultImg(e)}
                                  />
                                </td>
                                <td>
                                  {' '}
                                  <h1>
                                    {item.contract_ticker_symbol}
                                    {` (${item.contract_name})`}
                                  </h1>
                                </td>
                                <td>
                                  {' '}
                                  <h1>
                                    <a
                                      href={`https://basescan.org/address/${item.contract_address}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {item.contract_address}
                                    </a>
                                  </h1>
                                </td>
                                <td>
                                  {' '}
                                  <p>
                                    {toReadableAmount(
                                      item.balance,
                                      item.contract_decimals
                                    )}{' '}
                                    {item.contract_ticker_symbol}
                                  </p>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <></>
                          )}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </Grid>
  );
};

export default Profile;
