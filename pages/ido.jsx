import React, { useState } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

import Logo from '@/logo_new.png';
import { TwitterLink, DiscordLink } from '@/config/config';

const Donate = () => {
  const [type, setType] = useState('sale');
  const [farming, setFarming] = useState('farming');
  const [totalRaised, setTotalRaised] = useState(0);
  const [amount, setAmount] = useState(0);
  return (
    <div className="page-wrapper">
      <Header />
      <Head>
        <title>Presale | XYXY Finance</title>
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
        <link rel="manifest" href="/site.webmanifest" />
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
      <div className="presale">
        <div spacing={2} className="default-container page-layout">
          <div spacing={2} className="presale-wrapper">
            <div className="presale-card">
              <div className="presale-card-info">
                <div className="presale-image-container">
                  <Image
                    src={Logo.src}
                    className="presale-img"
                    layout="fixed"
                    width={150}
                    height="150"
                    alt="presale-logo"
                  />
                </div>

                <div className="presale-card-info-content">
                  <div className="presale-card-info-content-title">
                    <h1>XYXY swap</h1>
                    <div className="presale-card-info-content-tags">
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={TwitterLink}
                      >
                        <img
                          alt=""
                          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAZCAYAAAArK+5dAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAF2SURBVHgB7ZW9UcNAEIXfCTICXIJLMBXYVICpAHvGZsigA8sVIDKPTSBXgOjAVAAdoBJEQMKPlidpNJbQ3UkiwYG/mVOwd7tvd7U6AXv+G4W/MpEbOOhD0OF6xL3yUvuVdLFQoVlgKiM6hHTYGINPxaPn9S/rC20RYvqu1Dg3OhVnB2c8+IBLGWqDJ/Zq8IQeExvQP2J1A7MAeECxbFBkIq5mvw8b3/QvVF8ViFnqdnfGjF+5XLall9oycT2CDYPPi6aqwAFfGAoiQJdrxsDPFBImMEQLHE0Wt3yas1TWvaheIGaZWdbtkdS3RmCl7lBuUXM+0/bWCGTWc1ayZkYRmiJMyt9+YDmHhuNdilygDQqezqyvYJHOsYumCHws1bq5QMKS8yw4YWY+7ITs/dy06cBO9vnbgn/gVNf7nPJll9yEcdr7LLBt5mME+MKYwa2DoL+ukxs1eckxhcoiIVdA8YDj/IQG1P8PRtLBEY7xjre6bPfsJj/ZH23rHhE0kwAAAABJRU5ErkJggg=="
                        />
                      </a>
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={DiscordLink}
                      >
                        <img
                          alt=""
                          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAZCAYAAAArK+5dAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGFSURBVHgB7VRLUsJAFOyXQtc5QrgBnkBugDcQq5RiJ55AvAFswUWOwA3UE8gRhhuwBzP2DAmZTD5YceFCuiowef3m9Xw6DzjjryGN7IPu8feazweWsi5wYx3hC4NK7qTASE+h8Ug2TCNrjt0iW/J9/vfSd4UEc7zK7LSAKQ48ow0SPPkiRQGz7QRvHEVoA82d7dBFLNssFHgrGLYubmCOtMOjdRB4Kbf4LQSTaoGx7qN69cpu3cchpioEQtzbWp5AYi3nF5lgIV2e65UnomzMcBp3pXlBXitwlHulFS5lbsexKPKxw65szGApMfyd6LxW4AQj+Bjq0FlA6DCRVzAsvEvO5zYdaY0yVpz8wqwb+N+G8XyH/B5TLrNsjoXITwTaIxUIahOqnFOX15DbccZT65rsrMVOmjG24di4IuLj3sk7OQXTlw7eD4+CptYxzcWQreKCZy32izZQ1op1MCa4xCeyS9d02o53ljkMdd30IDQgu6HACk0wLV0zd89u6vSgM/4RvgFObXsa/4iJSQAAAABJRU5ErkJggg=="
                        />
                      </a>
                    </div>
                  </div>
                  <div className="presale-card-info-content-para">
                    Introducing the Basetrade Token Sale, offering a total of
                    150,000,000 $XYXY for purchase. The distinctive sale
                    includes overflow farming, granting users additional XYXY
                    as a bonus tied to their commitment. This presents you with
                    an early opportunity to participate in the top notch
                    decentralized perpetual exchange on Base.
                  </div>
                </div>
              </div>
            </div>
            <div className="presale-cards">
              <div className="presale-cards-left">
                <div className="presale-card">
                  <div className="tap-block">
                    <button
                      className={
                        type === 'sale'
                          ? 'tap-option muted active'
                          : 'tap-option muted'
                      }
                      onClick={() => setType('sale')}
                    >
                      Sale
                    </button>
                    <button
                      className={
                        type === 'claim'
                          ? 'tap-option muted active'
                          : 'tap-option muted'
                      }
                      onClick={() => setType('claim')}
                    >
                      Claim
                    </button>
                  </div>
                  {type === 'sale' ? (
                    <div className="presale-card-progress">
                      <div className="presale-progress">
                        <div className="presale-progress-info">
                          <h1>{totalRaised}/100 ETH</h1>
                          <h1>0%</h1>
                        </div>
                        <div className="progress-bar">
                          <div
                            className="progress-bar-inner"
                            style={{ width: '0%' }}
                          ></div>
                        </div>
                      </div>
                      <div className="presale-card-input-right">
                        <h1>Balance: {totalRaised} ETH</h1>
                        <a className="disable-anchor">MAX</a>
                      </div>
                      <div className="presale-card-inner">
                        <div className="presale-card-input">
                          <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.0"
                          />
                        </div>
                      </div>
                      <div className="presale-card-progress-button">
                        <button disabled="">Buy</button>
                      </div>
                      <div className="presale-card-progress-info">
                        <div className="App-card-divider"></div>
                        <div className="presale-card-progress-info-col">
                          <h1>Your Committed</h1>
                          <p>0 ETH</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="presale-card-progress">
                      <div className="presale-card-progress-info">
                        <div className="presale-card-progress-info-col">
                          <h1>Your Committed</h1>
                          <p>0 ETH</p>
                        </div>
                        <div className="app-card-divider"></div>
                        <div className="presale-card-progress-info-col">
                          <h1>ETH to Refund</h1>
                          <p>0 ETH</p>
                        </div>
                        <div className="app-card-divider"></div>
                        <div className="presale-card-progress-info-col">
                          <h1>Claimable</h1>
                          <p>0 $XYXY</p>
                        </div>
                        <div className="app-card-divider"></div>
                        <div className="presale-card-progress-info-col">
                          <h1>Earned Farming Bonuses</h1>
                          <p style={{ color: 'rgb(42, 128, 255)' }}>
                            0 $XYXY
                          </p>
                        </div>
                        <div className="claim-button-actions">
                          <button disabled="">Claim</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {/* <div className="presale-card">
                  <div className="tap-block">
                    <button
                      className={
                        farming === 'farming'
                          ? 'tap-option muted active'
                          : 'tap-option muted'
                      }
                      onClick={() => setFarming('farming')}
                    >
                      Farming Overflow
                    </button>
                    <button
                      className={
                        farming === 'claming'
                          ? 'tap-option muted active'
                          : 'tap-option muted'
                      }
                      onClick={() => setFarming('claming')}
                    >
                      Claiming Process
                    </button>
                  </div>
                  {farming === 'farming' ? (
                    <div style={{ marginTop: '1.66rem' }}>
                      <h1
                        style={{
                          fontSize: '1.2rem',
                          color: 'white',
                          fontWeight: '400',
                        }}
                      >
                        Farming Overflow is an improved launch model that, while
                        maintaining all the classic Overflow benefits such as
                        fairness and transparency it carries a substantial
                        improvement: it rewards early bird contributors. It
                        ensures that every single ETH contributed to the pool
                        generates income until it is returned. Users will be
                        able to farm and generate extra yield while waiting for
                        the sale to end. The current APR will be shown in the
                        'Sale' section. Tokens allocated to Token Sale Pool:
                        5,480,000 $esXYXY
                      </h1>
                    </div>
                  ) : (
                    <div style={{ marginTop: '1.66rem' }}>
                      <h1
                        style={{
                          fontSize: '1.2rem',
                          color: 'white',
                          fontWeight: '400',
                        }}
                      >
                        $XYXY and $esXYXY will be claimable immediately after
                        launch. In the 'Claim' section, you will be able to
                        check the invested amount, the final $XYXY and $esXYXY
                        allocation and the ETH to be refunded.
                      </h1>
                    </div>
                  )}
                </div> */}
              </div>
              <div className="presale-cards-right">
                <div className="presale-card">
                  <div className="presale-card-right-main-info">
                    <div className="main-info-card">
                      <h1>APR</h1>
                      <h2>25.546%</h2>
                    </div>
                    <div className="main-info-card">
                      <h1>Total Raised</h1>
                      <h2>{totalRaised} ETH</h2>
                    </div>
                  </div>
                  <div className="presale-card-right-info">
                    <h1>Main Details</h1>
                    <div className="app-card-divider first-child"></div>
                    <div className="presale-card-right-col">
                      <h1>Token Sale Contract</h1>
                      <a
                        target="_blank"
                        rel="noreferrer"
                        href="https://basescan.org/address/0x2d6F76BF3Ab4Cba841888F7Afe847E0Af8737a34"
                      >
                        0x2d6F...7a34
                      </a>
                    </div>
                    <div className="app-card-divider"></div>
                    <div className="presale-card-right-col">
                      <h1>Softcap</h1>
                      <p>5</p>
                    </div>
                    {/* <div className="app-card-divider"></div>
                    <div className="presale-card-right-col">
                      <h1>Minimum Raise</h1>
                      <p>20 ETH</p>
                    </div> */}
                    <div className="app-card-divider"></div>
                    <div className="presale-card-right-col">
                      <h1>Hardcap</h1>
                      <p>20 ETH</p>
                    </div>
                    <div className="app-card-divider"></div>
                    <div className="presale-card-right-col">
                      <h1>Sale Price</h1>
                      <p>0.00000067 ETH</p>
                    </div>
                    {/* <div className="app-card-divider"></div>
                    <div className="presale-card-right-col">
                      <h1>Listing Price</h1>
                      <p>0.0000008 ETH</p>
                    </div> */}
                    <div className="app-card-divider"></div>
                    <div className="presale-card-right-col">
                      <h1>Total Token Sale</h1>
                      <p>400,000 $XYXY</p>
                    </div>
                    {/* <div className="app-card-divider"></div>
                    <div className="presale-card-right-col">
                      <h1>Farming bonus</h1>
                      <p className="bonus-info">5,480,000 $esXYXY</p>
                    </div> */}
                    <div className="app-card-divider"></div>
                    <div className="presale-card-right-col">
                      <h1>Start Time</h1>
                      <p>TBA</p>
                    </div>
                    <div className="app-card-divider"></div>
                    <div className="presale-card-right-col">
                      <h1>End Time</h1>
                      <p>TBA</p>
                    </div>
                    <div className="app-card-divider"></div>
                    <div className="presale-card-right-col">
                      <h1>Minimum / Maximum Committed</h1>
                      <p>0.01 ETH / 1 ETH</p>
                    </div>
                    <div className="app-card-divider"></div>
                    {/* <div className="presale-card-right-col">
                      <h1>Minimum Committed</h1>
                      <p>0.01 ETH</p>
                    </div> */}
                    {/* <div className="app-card-divider"></div>
                    <div className="presale-card-right-col">
                      <h1>Sale Method</h1>
                      <p>Farming Overflow</p>
                    </div> */}
                    {/* <div className="app-card-divider"></div>
                    <div className="presale-card-right-col">
                      <h1>Vesting</h1>
                      <p>100% released on TGE</p>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Donate;
