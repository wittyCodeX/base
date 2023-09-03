import React, { useState, createContext, useEffect } from 'react'
import { useEthersProvider, useEthersSigner } from '@/libs/ethers'
import { useAccount, useNetwork, erc20ABI } from 'wagmi'
import { fromReadableAmount, toReadableAmount } from '@/libs/utils';
import { toast } from 'react-toastify';
import { ethers } from 'ethers';
import { NativeCurrency } from '@/config/config';
import { Protocol } from '@uniswap/router-sdk';
import { useDebounce } from 'use-debounce';

import TokenList from '@uniswap/default-token-list/build/uniswap-default.tokenlist.json';
import qs from 'qs'
export const SwapContext = createContext()

function TradeContext(props) {
  const [fromToken, setFromToken] = useState()
  const [toToken, setToToken] = useState()
  const [loadingBalance, setLoadingBalance] = useState({
    from: false,
    to: false
  })
  const [fromBalance, setFromBalance] = useState()
  const [toBalance, setToBalance] = useState()
  const [sellAmount, setSellAmount] = useState()
  const [buyAmount, setBuyAmount] = useState()
  const [quote, setQuote] = useState(null)
  const [balanceError, setBalanceError] = useState(false)
  const [liquidityError, setLiquidityError] = useState(false)
  const [chainId, setChainId] = useState()
  const [wrongChain, setWrongChain] = useState(false)
  const [connected, setConnected] = useState(false)
  const [account, setAccount] = useState()
  const [estimateGas, setEstimateGas] = useState();
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [updatedBuyBalanceFromQuote, setUpdatedBuyBalanceFromQuote] = useState(false);
  const [updatedSellBalanceFromQuote, setUpdatedSellBalanceFromQuote] = useState(false);

  const [amountToSell] = useDebounce(sellAmount, 1000);
  const [amountToBuy] = useDebounce(buyAmount, 1000);

  const { address, isConnected } = useAccount();
  const { chain } = useNetwork()
  const provider = useEthersProvider()
  const signer = useEthersSigner()

  const initContext = async () => {
    setUpdatedSellBalanceFromQuote(true)
    setUpdatedBuyBalanceFromQuote(true)
    setSellAmount()
    setBuyAmount()
    setQuote(null)
    setBalanceError(false)
    setLiquidityError(false)
    setEstimateGas('')
    await updateBalance()
  }
  //get Balance
  const getBalance = async (token) => {
    if (!token) return;
    try {
      if (token.isNative === true) {
        const balance = await signer?.getBalance();
        return toReadableAmount(balance, 18);
      } else {
        const contractFrom = new ethers.Contract(
          token.address,
          erc20ABI,
          provider
        );
        const balance1 = await contractFrom.balanceOf(address);
        return toReadableAmount(balance1, token.decimals)
      }
    } catch (e) {
      return 0;
    }

  }
  // Update Balance of fromToken and toToken
  const updateBalance = async () => {
    setLoadingBalance({
      ...loadingBalance,
      from: true,
    })
    const balanceFrom = await getBalance(fromToken);
    setFromBalance(balanceFrom)

    setLoadingBalance({
      ...loadingBalance,
      to: true,
    })
    const balanceTo = await getBalance(toToken);
    setToBalance(balanceTo)

    setLoadingBalance({
      ...loadingBalance,
      from: false,
      to: false
    })
  }
  // Notification Template
  const notify = (type, message) => {
    const options =
    {
      position: toast.POSITION.TOP_CENTER
    }

    switch (type) {
      case type === 'success':
        toast.success(message, options);
      case type === 'error':
        toast.error(message, options);
      case type === 'success':
        toast.success(message, options);
      case type === 'warning':
        toast.warn(message, options);
      case type === 'info':
        toast.info(message, options);
      default:
        toast(message, {
          position: toast.POSITION.BOTTOM_RIGHT,
          className: 'foo-bar'
        });
    }
  }

  async function fetchPrice(type, amount) {

    if (!amount) return;

    const protocols = [Protocol.V2, Protocol.V3, Protocol.MIXED];
    const DEFAULT_QUERY_PARAMS = {
      protocols,
    };
    const classic = {
      ...DEFAULT_QUERY_PARAMS,
      routingType: 'CLASSIC',
    };
    // routing API quote query params: https://github.com/Uniswap/routing-api/blob/main/lib/handlers/quote/schema/quote-schema.ts

    const requestBody = {
      sellToken: fromToken.symbol === 'ETH' ? 'ETH' : fromToken.address,
      buyToken: toToken.symbol === 'ETH' ? 'ETH' : toToken.address,
      sellAmount: amount,
      // if forceUniswapXOn is not ON, then use the backend's default value
    };
    const query = qs.stringify(requestBody)

    try {
      setLoadingQuote(true);
      const res = await fetch('/api/price?' + query);
      const response = await res.json();
      console.log(response)

      setLoadingQuote(false);
      return response;
    } catch (e) {
      console.log(e.message);
      setLoadingQuote(false);
      return null;
    }
  }
  /** UseEffect Hooks */
  // Default Tokens
  useEffect(() => {
    const tokens = TokenList.tokens.filter((token) => token.chainId === 8453);
    const toTokenData = tokens.filter((item) => item.symbol === 'DAI');
    setToToken(toTokenData[0]);
    setFromToken(NativeCurrency);

    return () => {
      initContext()
    }
  }, []);

  // Chain hook
  useEffect(() => {
    if (chain && chain.id) {
      if (chain.id !== 8453) {
        setWrongChain(true)
      }
      setChainId(chain.id)
    }
  }, [chain])

  // Address hook
  useEffect(() => {
    if (address && isConnected) {
      setAccount(address)
    }
  }, [address])

  // Connected hook
  useEffect(() => {
    setConnected(isConnected)
  }, [isConnected])

  // Token Balance Hook
  useEffect(() => {
    updateBalance()
  }, [fromToken, toToken, signer, address])

  // Quote Hook for fromToken & sellBalance
  useEffect(() => {
    const fetchPriceData = async () => {
      if (!fromToken && !toToken) return;
      if (updatedSellBalanceFromQuote) return;

      setQuote(null)
      setBuyAmount();
      setLiquidityError(false)
      if (
        Number(amountToSell) === 0 ||
        Number(amountToSell) < 0 ||
        Number(amountToSell) === NaN
      ) {
        setBuyAmount('')
        return;
      }

      if (
        (fromToken.symbol === 'ETH' && toToken.symbol === 'WETH') ||
        (toToken.symbol === 'ETH' && fromToken.symbol === 'WETH')
      ) {
        setBuyAmount(amountToSell);
        setUpdatedBuyBalanceFromQuote(true)
        setQuote({ action: 'wrapping' });
        return;
      }
      const amount = fromReadableAmount(amountToSell, fromToken.decimals)
      const data = await fetchPrice('EXACT_INPUT', amount);

      setQuote(data);
      if (data && data.buyAmount) {
        setBuyAmount(toReadableAmount(data.buyAmount, toToken.decimals));
        setUpdatedBuyBalanceFromQuote(true)
        setEstimateGas(data.gas);
      } else {
        setLiquidityError(true)
      }
    };
    fetchPriceData();
  }, [fromToken, amountToSell]);

  // Quote Hook for toToken & buyBalance
  useEffect(() => {
    const fetchPriceData = async () => {
      console.log(toToken)
      if (!fromToken && !toToken) return;
      if (updatedBuyBalanceFromQuote) return;
      setQuote(null)
      setSellAmount();
      setLiquidityError(false)

      if (
        Number(amountToBuy) === 0 ||
        Number(amountToBuy) < 0 ||
        Number(amountToBuy) === NaN
      )
        return;

      if (
        (fromToken.symbol === 'ETH' && toToken.symbol === 'WETH') ||
        (toToken.symbol === 'ETH' && fromToken.symbol === 'WETH')
      ) {
        setSellAmount(amountToBuy);
        setUpdatedSellBalanceFromQuote(true)
        setQuote({ action: 'wrapping' });
        return;
      }
      const amount = fromReadableAmount(amountToBuy, toToken.decimals)
      const data = await fetchPrice('EXACT_OUTPUT', amount);

      setQuote(data);
      if (data && data.buyAmount) {
        setSellAmount(toReadableAmount(data.buyAmount, toToken.decimals));
        setUpdatedSellBalanceFromQuote(true)
        setEstimateGas(data.gas);
      }
    };
    fetchPriceData();
  }, [toToken, amountToBuy]);

  useEffect(() => {
    setBalanceError(false)
    if (Number(sellAmount) > Number(fromBalance)) setBalanceError(true)
  }, [sellAmount, fromBalance])
  return (
    <SwapContext.Provider
      value={{ fromToken, setFromToken, toToken, setToToken, fromBalance, toBalance, sellAmount, setSellAmount, buyAmount, setBuyAmount, balanceError, loadingBalance, quote, provider, account, signer, liquidityError, setLiquidityError, loadingQuote, chainId, estimateGas, wrongChain, initContext, getBalance, notify, connected, setUpdatedBuyBalanceFromQuote, setUpdatedSellBalanceFromQuote }}
    >
      {props.children}
    </SwapContext.Provider>
  )
}

export default TradeContext;