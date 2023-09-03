import React, { useState, useEffect, useContext } from 'react';
import Image from 'next/image';
import { Button } from '@mui/material';
import { useAccount, useNetwork, erc20ABI } from 'wagmi';
import { ethers } from 'ethers';
import { Token } from '@uniswap/sdk-core';
import { WETH9, ExtendedEther } from '@uniswap/smart-order-router';
import { WETH_ABI, MAX_ALLOWANCE, ExchangeProxyAddress } from '@/config/config';
import { toReadableAmount, didUserReject } from '@/libs/utils';
import { useEthersSigner, useEthersProvider } from '@/libs/ethers';
import { SwapContext } from '@/context/swapContext';
import qs from 'qs';

import LoadingSVG from '@/loading.svg';

export default function QuoteView() {
  // fetch quote here
  const {
    fromToken,
    toToken,
    quote,
    notify,
    liquidityError,
    setLiquidityError,
    initContext,
    balanceError,
  } = useContext(SwapContext);

  console.log(quote);
  const [isLoading, setIsLoading] = useState(false);

  const { address } = useAccount();
  const { chain } = useNetwork();
  const correctNetwork = chain && chain.id === 8453;

  const signer = useEthersSigner();
  const provider = useEthersProvider();

  const swapToken = async () => {
    if (balanceError) return;
    initContext();

    try {
      if (fromToken.symbol === 'ETH' && toToken.symbol === 'WETH') {
        return await wrapEth(quote.sellAmount);
      }
      if (fromToken.symbol === 'WETH' && toToken.symbol === 'ETH') {
        return await unWrapEth(quote.sellAmount);
      }
      const res = await executeTrade();
      if (res === 'Failed') {
        initContext();
        setLiquidityError(true);
        return;
      }
      initContext();
      notify('success', 'Swwap Succesful!');
    } catch (e) {
      if (didUserReject(e)) {
        notify('error', 'User rejected transaction');
      }
    }
  };

  // Wrapping eth to weth
  const wrapEth = async (amount) => {
    try {
      setIsLoading(true);
      const WETH_CONTRACT = new ethers.Contract(
        WETH9[chain.id].address,
        WETH_ABI,
        signer
      );
      const tx = await WETH_CONTRACT.deposit({
        from: address,
        value: amount,
      });
      const res = await tx.wait();
      setIsLoading(false);
      return res;
    } catch (e) {
      if (didUserReject(e)) {
        notify('error', 'User rejected transaction');
      }
      setIsLoading(false);
      return null;
    }
  };
  // unwrapping weth to eth
  const unWrapEth = async (amount) => {
    try {
      setIsLoading(true);
      const WETH_CONTRACT = new ethers.Contract(
        WETH9[chain.id].address,
        WETH_ABI,
        signer
      );
      const tx = await WETH_CONTRACT.withdraw(amount);
      const res = await tx.wait();
      setIsLoading(false);
      return res;
    } catch (e) {
      if (didUserReject(e)) {
        notify('error', 'User rejected transaction');
      }
      setIsLoading(false);
      return null;
    }
  };

  async function executeTrade() {
    if (!address || !provider) {
      throw new Error('Cannot execute a trade without a connected wallet');
    }
    setIsLoading(true);
    const args = {
      sellToken: fromToken.symbol === 'ETH' ? 'ETH' : fromToken.address,
      buyToken: toToken.symbol === 'ETH' ? 'ETH' : toToken.address,
      sellAmount: quote.sellAmount,
      takerAddress: address,
    };
    if (fromToken.symbol !== 'ETH') {
      const txApprove = await getTokenTransferApproval(fromToken);
      if (txApprove === 'Failed') {
        return 'Failed';
      }
    }
    const query = qs.stringify(args);
    const tx = await fetch('/api/quote?' + query).then((res) => res.json());
    console.log(tx);

    if (tx && tx.to) {
      const res = await signer.sendTransaction({
        to: tx.to,
        data: tx.data,
        value: tx.value,
      });
      const swapReceipt = await res.wait();
      setIsLoading(false);
      return swapReceipt;
    } else {
      setIsLoading(false);
      return 'Failed';
    }
  }

  async function getTokenTransferApproval(token) {
    if (!provider || !address) {
      console.log('No Provider Found');
      return 'Failed';
    }

    try {
      const tokenContract = new ethers.Contract(
        token.address,
        erc20ABI,
        provider
      );
      console.log(tokenContract);
      const allowance = await tokenContract.allowance(
        address,
        ExchangeProxyAddress
      );
      console.log(allowance);

      const isApproved =
        Number(toReadableAmount(allowance, token.decimals)) >=
        Number(toReadableAmount(quote.sellAmount, token.decimals));

      if (!isApproved) {
        const transaction = await tokenContract.populateTransaction.approve(
          ExchangeProxyAddress,
          MAX_ALLOWANCE
        );
        const txApproval = await signer.sendTransaction(transaction);
        const { transactionHash } = await txApproval.wait();
      }
      return 'Success';
    } catch (e) {
      console.error(e);
      if (didUserReject(e)) {
        notify('error', 'User rejected transaction');
      }

      return 'Failed';
    }
  }

  useEffect(() => {
    return () => {
      setIsLoading(false);
    };
  }, []);
  const formatToken = (token) => {
    if (!token) return;
    if (token.isNative) {
      return new ExtendedEther(token.chainId);
    } else {
      return new Token(
        token.chainId,
        token.address,
        token.decimals,
        token.symbol,
        token.name
      );
    }
  };

  if (isLoading) {
    return (
      <Button
        component={'button'}
        variant="contained"
        className="swap-button liquidity-err"
        disabled
        fullWidth
      >
        <Image
          src={LoadingSVG}
          alt="Loading..."
          layout="fixed"
          width={30}
          height={30}
        />
        Approve & Swapping Token...
      </Button>
    );
  }
  if (liquidityError) {
    return (
      <Button variant="contained" className="swap-button" disabled fullWidth>
        <div className="balance-err">Insufficient Liquidity</div>
      </Button>
    );
  }
  if (!correctNetwork) {
    return (
      <Button variant="contained" className="swap-button" disabled fullWidth>
        <div className="balance-err">Wrong Network</div>
      </Button>
    );
  }

  if (balanceError) {
    return (
      <Button variant="contained" className="swap-button" disabled fullWidth>
        <div className="balance-err">Insufficient Balance</div>
      </Button>
    );
  }

  return (
    <Button
      component={'button'}
      variant="contained"
      className="swap-button"
      fullWidth
      onClick={() => {
        console.log('submitting quote to blockchain');
        swapToken();
      }}
    >
      SWAP TOKEN
    </Button>
  );
}
