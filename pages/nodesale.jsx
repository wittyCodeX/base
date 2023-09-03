import { useState, useEffect, useContext } from 'react';
import Head from 'next/head';
import { Button, Grid, Typography, InputBase, Container } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AlertModal from '@/components/AlertModal';
import { SwapContext } from '@/context/swapContext';
import LogoImage from '@/logo_new.png';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
// import NumericInput from 'react-numeric-input';
// import InputNumber from 'rc-input-number';

const LaunchPad = () => {
  const { notify } = useContext(SwapContext);

  const [type, setType] = useState('node1');
  const [mintValue1, setMintValue1] = useState(0)
  const [mintValue2, setMintValue2] = useState(0)

  const [amount, setAmount] = useState(0);
  const [buyPossible, setBuyPossible] = useState(false);
  const [buyError, setBuyError] = useState('');
  const [loadingBuy, setLoadingBuy] = useState(false);
  const [loadingClaim, setLoadingClaim] = useState(false);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleBuy = async () => { };

  const handleClaim = async () => { };

  const setMaxWallet = (index) => {
    if (index == 1) setMintValue1(100)
    else setMintValue2(100)
  }

  const countUp = (index) => {
    if (index == 1) {
      setMintValue1((preState) => {
        ++preState
        return preState <= 100 ? preState : 100
      })
    } else {
      setMintValue2((preState) => {
        ++preState
        return preState <= 100 ? preState : 100
      })
    }
  }

  const countDown = (index) => {
    if (index == 1) {
      setMintValue1((preState) => {
        --preState
        return preState <= 0 ? 0 : preState
      })
    } else {
      setMintValue2((preState) => {
        --preState
        return preState <= 0 ? 0 : preState
      })
    }

  }

  // useEffect(() => {
  //   if (provider) getXYXYPresaleStatus();
  // }, [provider]);

  return (
    <Grid className='page-wrapper'>
      <Header />
      <Head>
        <title>NodeSale | XYXY Finance</title>
        <link rel="icon" href="/favicon.ico" />{' '}
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
      <Grid
        className={
          open ? 'blur-background airdrop nodesale' : 'airdrop nodesale'
        }
      >
        <Typography
          variant="h3"
          textAlign={'center'}
          color={'white'}
          marginTop={5}
        >
          Node Sales
        </Typography>

        <Grid>
          <Container className="nodesale-container">
            <Grid container>
              <Grid xs={12} sm={8} md={6} className="tap-block">
                <button
                  className={
                    type === 'node1'
                      ? 'tap-option muted active'
                      : 'tap-option muted'
                  }
                  onClick={() => setType('node1')}
                >
                  Mint
                </button>
                <button
                  className={
                    type === 'node2'
                      ? 'tap-option muted active'
                      : 'tap-option muted'
                  }
                  onClick={() => setType('node2')}
                >
                  Manage
                </button>
              </Grid>
            </Grid>

            {type === 'node1' ? (
              <Grid container justifyContent='center'>
                <Grid item xs={12} sm={8} md={6} lg={4} mt={3} padding={2}>
                  <Grid className="wrapper" padding={1}>
                    <img
                      src="/assets/mint1.png"
                      alt="XYXY logo"
                      className="mint-logo"
                      style={{ width: '100%' }}
                    />

                    <Grid item mt={1} container justifyContent={'space-between'}>
                      <Typography>Node Name:</Typography>
                      <Typography>XYXY1</Typography>
                    </Grid>

                    <Grid item mt={1} container justifyContent={'space-between'}>
                      <Typography>APY:</Typography>
                      <Typography>7.4%</Typography>
                    </Grid>

                    <Grid item mt={1} container justifyContent={'space-between'}>
                      <Typography>Mint Price:</Typography>
                      <Typography>500 <span style={{ fontSize: '12px' }}>XYXY</span> </Typography>
                    </Grid>
                    <Grid item mt={1} container justifyContent={'space-between'}>
                      <Typography>Max per Wallet:</Typography>
                      <Typography>100 &nbsp;<span onClick={() => setMaxWallet(1)} style={{ color: '#2A80FF', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>MAX</span></Typography>
                    </Grid>
                    <Grid item mt={1} container justifyContent={'space-between'}>
                      <div className='updown-input'>
                        <div className='input-wrapper'>
                          <input type="number" min={0} max={100} placeholder='0' value={mintValue1} onChange={(e) => setMintValue1(() => e.target.value <= 100 ? e.target.value : 100)} />
                          <div className='btn-group'>
                            <Button fullWidth variant="text" onClick={() => countUp(1)}><KeyboardArrowUpIcon /></Button>
                            <Button fullWidth variant="text" onClick={() => countDown(1)}><KeyboardArrowDownIcon /></Button>
                          </div>
                        </div>
                      </div>
                    </Grid>
                    <Grid
                      mt={2}
                      mb={5}
                      item
                      container
                      justifyContent={'space-around'}
                      className="form-actions"
                    >
                      <Grid sm={12} item className="action-group">
                        <Button
                          fullWidth
                          variant="contained"
                          className="action-button"
                          onClick={handleBuy}
                        >
                          Approve
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={8} md={6} lg={4} mt={3} padding={2}>
                  <Grid className="wrapper" padding={1}>
                    <img
                      src="/assets/mint2.png"
                      alt="XYXY logo"
                      className="mint-logo"
                      style={{ width: '100%' }}
                    />

                    <Grid item mt={1} container justifyContent={'space-between'}>
                      <Typography>Node Name:</Typography>
                      <Typography>XYXY2</Typography>
                    </Grid>

                    <Grid item mt={1} container justifyContent={'space-between'}>
                      <Typography>APY:</Typography>
                      <Typography>7.4%</Typography>
                    </Grid>

                    <Grid item mt={1} container justifyContent={'space-between'}>
                      <Typography>Mint Price:</Typography>
                      <Typography>500 <span style={{ fontSize: '12px' }}>XYXY</span> </Typography>
                    </Grid>
                    <Grid item mt={1} container justifyContent={'space-between'}>
                      <Typography>Max per Wallet:</Typography>
                      <Typography>100 &nbsp;<span onClick={() => setMaxWallet(2)} style={{ color: '#2A80FF', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>MAX</span></Typography>
                    </Grid>
                    <Grid item mt={1} container justifyContent={'space-between'}>
                      <div className='updown-input'>
                        <div className='input-wrapper'>
                          <input type="number" min={0} placeholder='0' value={mintValue2} onChange={(e) => setMintValue2(() => e.target.value <= 100 ? e.target.value : 100)} />
                          <div className='btn-group'>
                            <Button fullWidth variant="text" onClick={() => countUp(2)}><KeyboardArrowUpIcon /></Button>
                            <Button fullWidth variant="text" onClick={() => countDown(2)}><KeyboardArrowDownIcon /></Button>
                          </div>
                        </div>
                      </div>
                    </Grid>
                    <Grid
                      mt={2}
                      mb={5}
                      item
                      container
                      justifyContent={'space-around'}
                      className="form-actions"
                    >
                      <Grid sm={12} item className="action-group">
                        <Button
                          fullWidth
                          variant="contained"
                          className="action-button"
                          onClick={handleBuy}
                        >
                          Approve
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            ) : (
              <Grid container justifyContent="center">
                <Grid item xs={12} sm={8} md={6} lg={4} mt={3} padding={2}>
                  <Grid className="wrapper" padding={2}>
                    <Grid className="header" padding={2}>
                      <Typography variant="h5">Register to Earn</Typography>
                      <img
                        src={LogoImage.src}
                        alt="XYXY logo"
                        className="project-logo"
                      />
                    </Grid>

                    <Grid item mt={5} pr={2} pl={2} container justifyContent={'space-between'}>
                      <Typography variant="h5">APY:</Typography>
                      <Typography variant="h5">7.4%</Typography>
                    </Grid>

                    <Grid item mt={5} pr={2} pl={2} container justifyContent={'space-between'}>
                      <Typography variant="h5">Total Registered:</Typography>
                      <Typography variant="h5">0 /100</Typography>
                    </Grid>
                    <Grid item mt={5} pr={2} pl={2} container justifyContent={'space-between'}>
                      <Typography variant="h5">Unclaimed Rewards:</Typography>
                      <Typography variant="h5">1</Typography>
                    </Grid>
                    <Grid
                      mt={2}
                      mb={5}
                      item
                      container
                      justifyContent={'space-around'}
                      className="form-actions"
                    >
                      <Grid item mt={2} className="action-group">
                        <Button
                          fullWidth
                          variant="contained"
                          className="action-button"
                          onClick={handleBuy}
                        >
                          BUY
                        </Button>
                      </Grid>
                      <Grid item mt={2} className="action-group">
                        <Button
                          fullWidth
                          variant="contained"
                          className="action-button"
                          onClick={handleClaim}
                        >
                          CLAIM
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={8} md={6} lg={4} mt={3} padding={2}>
                  <Grid className="wrapper" padding={2}>
                    <Grid className="header" padding={2}>
                      <Typography variant="h5">Register to Earn</Typography>

                      <img
                        src={LogoImage.src}
                        alt="XYXY logo"
                        className="project-logo"
                      />
                    </Grid>

                    <Grid item mt={5} pr={2} pl={2} container justifyContent={'space-between'}>
                      <Typography variant="h5">APY:</Typography>
                      <Typography variant="h5">7.4%</Typography>
                    </Grid>
                    <Grid item mt={5} pr={2} pl={2} container justifyContent={'space-between'}>
                      <Typography variant="h5">Total Registered:</Typography>
                      <Typography variant="h5">0 /100</Typography>
                    </Grid>
                    <Grid item mt={5} pr={2} pl={2} container justifyContent={'space-between'}>
                      <Typography variant="h5">Unclaimed Rewards:</Typography>
                      <Typography variant="h5">1</Typography>
                    </Grid>
                    <Grid
                      mt={2}
                      mb={5}
                      item
                      container
                      justifyContent={'space-around'}
                      className="form-actions"
                    >
                      <Grid item mt={2} className="action-group">
                        <Button
                          fullWidth
                          variant="contained"
                          className="action-button"
                          onClick={handleBuy}
                        >
                          BUY
                        </Button>
                      </Grid>
                      <Grid item mt={2} className="action-group">
                        <Button
                          fullWidth
                          variant="contained"
                          className="action-button"
                          onClick={handleClaim}
                        >
                          CLAIM
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            )}
          </Container>
        </Grid >
        <Footer />
      </Grid >
    </Grid>
  );
};

export default LaunchPad;
