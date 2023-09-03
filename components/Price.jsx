import React, { useEffect, useState, useContext } from 'react';
import Image from 'next/image';
import SwapInput from '@/components/SwapInput';
import { Grid, Typography } from '@mui/material';
import SwapCallsOutlinedIcon from '@mui/icons-material/SwapCallsOutlined';
import LoadingSVG from '@/loading.svg';
import { SwapContext } from '@/context/swapContext';

const PriceView = ({ slippage }) => {
  const {
    fromToken,
    toToken,
    sellAmount,
    buyAmount,
    fromBalance,
    toBalance,
    setSellAmount,
    setBuyAmount,
    setFromToken,
    setToToken,
    estimateGas,
    loadingQuote,
    loadingBalance,
    setUpdatedBuyBalanceFromQuote,
    setUpdatedSellBalanceFromQuote,
  } = useContext(SwapContext);

  // order change
  const changeOrder = () => {
    const tempVal = buyAmount;
    setBuyAmount(sellAmount);
    setSellAmount(tempVal);
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
  };

  return (
    <>
      {fromToken && (
        <SwapInput
          tokenType="sell"
          token={fromToken}
          balance={sellAmount}
          setBalance={setSellAmount}
          setToken={setFromToken}
          tokenBalance={fromBalance}
          loadingBalance={loadingBalance.from}
          setFromParent={setUpdatedSellBalanceFromQuote}
        />
      )}

      <Grid container justifyContent={'center'}>
        <div className="change-order">
          <SwapCallsOutlinedIcon onClick={changeOrder} />
        </div>
      </Grid>
      {toToken && (
        <SwapInput
          tokenType="buy"
          token={toToken}
          balance={buyAmount}
          setBalance={setBuyAmount}
          setToken={setToToken}
          tokenBalance={toBalance}
          loadingBalance={loadingBalance.to}
          setFromParent={setUpdatedBuyBalanceFromQuote}
        />
      )}
      <Grid item justifyContent={'space-between'} className="quoteInfo">
        {loadingQuote ? (
          <div className="fetching-price">
            <Image
              src={LoadingSVG}
              alt="Loading..."
              layout="fixed"
              width={20}
              height={20}
            />
            Fetching quote price...
          </div>
        ) : (
          <div></div>
        )}
        {estimateGas ? (
          <Typography color={'#a9b6bf'} textAlign={'right'}>
            Estimated Gas: ${Number(estimateGas)}
          </Typography>
        ) : (
          <div></div>
        )}
      </Grid>
    </>
  );
};

export default PriceView;
