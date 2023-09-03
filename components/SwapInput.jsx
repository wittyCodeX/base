import React, { useEffect, useState, useContext } from 'react';
import Image from 'next/image';
import { Grid, Box, Button, InputBase } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import TokenListModal from './TokenListModal';
import { SwapContext } from '@/context/swapContext';
import LoadingSVG from '@/loading.svg';

const SwapInput = ({
  tokenType,
  token,
  balance,
  setBalance,
  tokenBalance,
  loadingBalance,
  setToken,
  setFromParent,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalKey, setModalKey] = useState('');
  const [swapBalance, setSwapBalance] = useState(balance);

  const { balanceError } = useContext(SwapContext);

  const handleSetToken = (item) => {
    setToken(item);
  };

  const showModal = (key) => {
    setModalKey(key);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };

  const setMaxBalance = () => {
    if (tokenType !== 'sell') return;
    if (Number(tokenBalance) === 0 || NaN) return;
    setBalance(Number(tokenBalance).toFixed(3));
    setSwapBalance(Number(tokenBalance).toFixed(3));
    setFromParent(false);
  };

  const changeBalance = (value) => {
    setFromParent(false);
    setSwapBalance(value);
    setBalance(value);
  };

  useEffect(() => {
    if (!balance) setSwapBalance('');
    else setSwapBalance(balance);
  }, [balance]);
  return (
    <>
      <Grid item>
        <Box className="token-box">
          <Grid container alignItems={'center'}>
            <Button
              className="token-select"
              onClick={(e) => showModal(tokenType)}
            >
              {token?.logoURI !== 'unknown' ? (
                <img src={token?.logoURI} alt="icon" className="token-icon" />
              ) : (
                <div className="unknown-logo-main">?</div>
              )}
              {token?.symbol}
              <ArrowDropDownIcon />
            </Button>

            <InputBase
              type="number"
              value={swapBalance}
              placeholder="0.000"
              className="input-box"
              onChange={(e) => changeBalance(e.target.value)}
            />
          </Grid>
          <Grid container justifyContent={'space-between'}>
            <Grid className="balance-text" onClick={() => setMaxBalance()}>
              Balance:{' '}
              <span>
                {loadingBalance ? (
                  <>
                    <Image
                      src={LoadingSVG}
                      alt="Loading..."
                      layout="fixed"
                      width={15}
                      height={15}
                    />
                  </>
                ) : (
                  <>
                    {Number(tokenBalance).toFixed(3)} {token?.symbol}
                  </>
                )}
              </span>
            </Grid>

            <Grid>
              {balanceError && tokenType === 'sell' && (
                <span className="balance-err">Insufficient Balance</span>
              )}
            </Grid>
          </Grid>
        </Box>
      </Grid>
      <TokenListModal
        modalOpen={modalOpen}
        closeModal={closeModal}
        modalKey={modalKey}
        setToken={handleSetToken}
      />
    </>
  );
};

export default SwapInput;
