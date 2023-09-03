import { useState, useEffect, useContext } from 'react';
import Head from 'next/head';
import { Button, Grid, Typography, InputBase, Container } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import Countdown from 'react-countdown';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

import XYXYPresaleABI from '@/config/XYXYPresale.json';
import AlertModal from '@/components/AlertModal';
import { xyxyPresaleContractAddress, XYXY_DECIMALS } from '@/config/config';
import { ethers } from 'ethers';
import { useAccount, useNetwork } from 'wagmi';
import { useEthersProvider, useEthersSigner } from '@/libs/ethers';
import { SwapContext } from '@/context/swapContext';
import LogoImage from '@/logo_new.png';

const Started = () => <span>Started!</span>;
const Ended = () => <span>Ended</span>;

const LaunchPad = () => {
  const startDatePeriod = 1692094808210 + 1036800000;
  const endDatePeriod = startDatePeriod + 5000000000;

  const { chain } = useNetwork();
  const { address, isConnected } = useAccount();
  const provider = useEthersProvider();
  const signer = useEthersSigner();

  const { notify } = useContext(SwapContext);

  const correctNetwork = chain && chain.id === 8453;

  const [amount, setAmount] = useState(0);
  const [buyPossible, setBuyPossible] = useState(false);
  const [buyError, setBuyError] = useState('');
  const [loadingBuy, setLoadingBuy] = useState(false);
  const [loadingClaim, setLoadingClaim] = useState(false);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');

  const [started, setStarted] = useState(false);
  const [tokenPerEth, setTokenPerEth] = useState('');
  const [finished, setFinished] = useState(true);
  const [maxCommit, setMaxCommit] = useState(0);
  const [minCommit, setMinCommit] = useState(0);
  const [commitment, setCommitment] = useState(0);
  const [userClaimed, setUserClaimed] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const startDateRenderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      setStarted(true);
      return <Started />;
    } else {
      return (
        <span>
          {days} Day : {hours} Hour : {minutes} Min : {seconds} Sec
        </span>
      );
    }
  };

  const endDateRenderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return <Ended />;
    } else {
      return (
        <span>
          {days} Day : {hours} Hour : {minutes} Min : {seconds} Sec
        </span>
      );
    }
  };

  const getXYXYPresaleStatus = async () => {
    const XYXYPresale = new ethers.Contract(
      xyxyPresaleContractAddress,
      XYXYPresaleABI.abi,
      provider
    );

    const _tokenPerEth = await XYXYPresale.tokenPerETH();
    setTokenPerEth(_tokenPerEth.toString());

    const _finished = await XYXYPresale.finished();
    setFinished(_finished);

    const _minCommit = await XYXYPresale.minCommit();
    setMinCommit(
      ethers.utils.formatUnits(_minCommit.toString(), XYXY_DECIMALS)
    );

    const _maxCommit = await XYXYPresale.maxCommit();
    setMaxCommit(
      ethers.utils.formatUnits(_maxCommit.toString(), XYXY_DECIMALS)
    );

    const _commitment = await XYXYPresale.commitments(address);
    setCommitment(
      ethers.utils.formatUnits(_commitment.toString(), XYXY_DECIMALS)
    );

    const _userClaimed = await XYXYPresale.userClaimed(address);
    setUserClaimed(_userClaimed);
  };

  const handleBuy = async () => {
    setLoadingBuy(true);
    const XYXYPresale = new ethers.Contract(
      xyxyPresaleContractAddress,
      XYXYPresaleABI.abi,
      provider
    );

    const walletSigner = provider.getSigner(address);
    const signer = XYXYPresale.connect(walletSigner);

    try {
      const tx = await signer.commit({
        value: ethers.utils.parseEther(amount),
      });
      notify('info', `Transaction has been submited. Tx hash: ${tx.hash}`);

      tx.wait().then(() => {
        setLoadingBuy(false);
        handleOpen();
        setText(`You have bought ${amount * tokenPerEth} + XYXY successfully.`);
        setLoadingBuy(false);
        getXYXYPresaleStatus();
      });
    } catch (error) {
      console.log(error);
      setLoadingBuy(false);
    }
  };

  const handleClaim = async () => {
    setLoadingClaim(true);
    const XYXYPresale = new ethers.Contract(
      xyxyPresaleContractAddress,
      XYXYPresaleABI.abi,
      provider
    );
    try {
      const tx = await signer.claim();
      notify('info', `Transaction has been submited. Tx hash: ${tx.hash}`);

      tx.wait().then(() => {
        setLoadingClaim(false);
        handleOpen();
        setText(
          `You've claimed ${commitment * tokenPerEth} + XYXY successfully.`
        );
        setLoadingClaim(false);
        getXYXYPresaleStatus();
      });
    } catch (error) {
      console.log(error);
      setLoadingClaim(false);
    }
  };

  // useEffect(() => {
  //   if (provider) getXYXYPresaleStatus();
  // }, [provider]);

  useEffect(() => {
    if (amount) {
      if (amount > Number(minCommit) && amount < Number(maxCommit)) {
        if (finished) {
          setBuyPossible(false);
          setBuyError('Presale is finished.');
        } else {
          setBuyPossible(true);
          setBuyError('');
        }
      } else {
        setBuyPossible(false);
        setBuyError('You can only buy from 0.01ETH to 10ETH.');
      }
    }
  }, [amount]);

  const handleInput = (value) => {
    if (!correctNetwork) {
      notify('error', 'Wrong Network');

      return;
    }
    if (!started) {
      notify('warning', 'Presale is not started yet');
      return;
    }
    console.log(value);
    if (correctNetwork && started) setAmount(value);
  };
  return (
    <Grid className='page-wrapper'>
      <Header />

      <Head>
        <title>Launchpad | XYXY Finance</title>
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
          open ? 'blur-background airdrop launchpad' : 'airdrop launchpad'
        }
      >
        <Typography
          variant="h3"
          textAlign={'center'}
          color={'white'}
          marginTop={10}
        >
          LaunchPad
        </Typography>

        <Grid container>
          <Container>
            <Grid item xs={12} sm={8} md={6} lg={4} marginX={'auto'} mt={3}>
              <Grid className="wrapper" padding={2}>
                <Grid className="header" padding={2}>
                  <img
                    src={LogoImage.src}
                    alt="XYXY logo"
                    className="project-logo"
                  />
                  <Typography>XYXY project</Typography>
                </Grid>

                <Grid mt={3}>
                  <Typography textAlign={'center'}>Softcap/Hardcap</Typography>
                  <div className="progress-bar">
                    <div className="progress"></div>
                  </div>
                  <Grid container justifyContent={'space-between'}>
                    <Typography fontSize={14}>10 ETH</Typography>
                    <Typography fontSize={14}>50 ETH</Typography>
                  </Grid>
                </Grid>

                <Grid mt={2}>
                  <Grid container justifyContent={'space-between'}>
                    <Typography>Price</Typography>
                    <Typography>1 ETH = {tokenPerEth} XYXY</Typography>
                  </Grid>

                  <Grid container justifyContent={'space-between'}>
                    <Typography>Starts In</Typography>
                    <Countdown
                      date={startDatePeriod}
                      renderer={startDateRenderer}
                    />
                  </Grid>

                  <Grid container justifyContent={'space-between'}>
                    {started ? (
                      <>
                        <Typography>Ends In</Typography>
                        <Countdown
                          date={endDatePeriod}
                          renderer={endDateRenderer}
                        />
                      </>
                    ) : (
                      <>
                        <Typography>Presale Period</Typography>
                        <Typography>7 days</Typography>
                      </>
                    )}
                  </Grid>

                  <Grid mt={2}>
                    <InputBase
                      placeholder="Amount"
                      className={!correctNetwork || !started ? 'disabled' : ''}
                      fullWidth={true}
                      value={amount}
                      onChange={(e) => handleInput(e.target.value)}
                      type="number"
                    />
                    {buyError && amount ? (
                      <span className="amoutn_error">{buyError}</span>
                    ) : (
                      <></>
                    )}
                    {isConnected ? (
                      <LoadingButton
                        loading={loadingBuy}
                        fullWidth={true}
                        variant="contained"
                        className={!buyPossible || !started ? 'disabled' : ''}
                        disabled={!buyPossible || !started}
                        onClick={handleBuy}
                      >
                        BUY
                      </LoadingButton>
                    ) : (
                      <Button
                        variant="contained"
                        className="disabled"
                        disabled
                        fullWidth
                      >
                        Connect Wallet
                      </Button>
                    )}
                  </Grid>

                  <Grid mt={2}>
                    <LoadingButton
                      loading={loadingClaim}
                      fullWidth
                      variant="contained"
                      className={
                        !(finished && !userClaimed && Number(commitment) > 0)
                          ? 'disabled'
                          : ''
                      }
                      disabled={
                        !(finished && !userClaimed && Number(commitment) > 0)
                      }
                      onClick={handleClaim}
                    >
                      CLAIM
                    </LoadingButton>
                  </Grid>
                </Grid>
              </Grid>

              <Grid mt={10}>
                <Button
                  fullWidth
                  variant="outlined"
                  href="https://docs.google.com/forms/d/e/1FAIpQLSfNeHG9rcjBPoTDU-eHfcg8_o7F45TvF0zPrRwT2KB15DV3bg/viewform"
                  color="secondary"
                >
                  SUBMIT YOUR PROJECT
                </Button>
              </Grid>
            </Grid>
          </Container>
        </Grid>
        <AlertModal
          modalOpen={open}
          closeModal={handleClose}
          text={text}
        ></AlertModal>
        <Footer />
      </Grid>
    </Grid>
  );
};

export default LaunchPad;
