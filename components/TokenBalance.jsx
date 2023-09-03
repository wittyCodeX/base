import React, { useState, useEffect, useContext } from 'react';
import Image from 'next/image';
import LoadingSVG from '@/loading.svg';
import { SwapContext } from '@/context/swapContext';

const TokenBalance = ({ token }) => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const { getBalance } = useContext(SwapContext);

  useEffect(() => {
    async function fetchBalance() {
      if (token) {
        setLoading(true);
        const bal = await getBalance(token);
        setLoading(false);
        setBalance(bal);
      }
    }
    fetchBalance();
    return () => {
      setBalance(0);
    };
  }, [token]);

  if (loading)
    return (
      <Image
        src={LoadingSVG}
        alt="Loading..."
        layout="fixed"
        width={20}
        height={20}
      />
    );
  return <div style={{ paddingRight: '10px' }}>{balance}</div>;
};

export default TokenBalance;
