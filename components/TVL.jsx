import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import LoadingSVG from '@/loading.svg';

const TVL = ({ protocol }) => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);

  const convertCurrency = (labelValue) => {
    return Number(labelValue) >= 1.0e9
      ? (Number(labelValue) / 1.0e9).toFixed(2) + 'B'
      : Number(labelValue) >= 1.0e6
      ? (Number(labelValue) / 1.0e6).toFixed(2) + 'M'
      : Number(labelValue) >= 1.0e3
      ? (Number(labelValue) / 1.0e3).toFixed(2) + 'K'
      : Number(labelValue).toFixed(2);
  };

  useEffect(() => {
    const getDexTVL = async (protocol) => {
      setLoading(true);
      const response = await fetch(`/api-llama/tvl/${protocol}`);
      const result = await response.json();
      console.log(result);
      setBalance(convertCurrency(result));
      setLoading(false);
    };
    protocol && getDexTVL(protocol);
  }, [protocol]);

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
  return balance;
};

export default TVL;
