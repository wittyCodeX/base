import React from 'react';
import {
  erc20ABI,
  useContractRead,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import LoadingButton from '@mui/lab/LoadingButton';
import { Typography, Box, Button, InputBase } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

import { MAX_ALLOWANCE } from '@/config/config';

export default function ApproveOrReviewButton({
  takerAddress,
  onClick,
  sellTokenAddress,
  exchangeProxy,
}) {
  // 1. Read from erc20, does spender (0x Exchange Proxy) have allowance?
  const { data: allowance, refetch } = useContractRead({
    address: sellTokenAddress,
    abi: erc20ABI,
    functionName: 'allowance',
    args: [takerAddress, exchangeProxy],
  });

  // 2. (only if no allowance): write to erc20, approve 0x Exchange Proxy to spend max integer
  const { config } = usePrepareContractWrite({
    address: sellTokenAddress,
    abi: erc20ABI,
    functionName: 'approve',
    args: [exchangeProxy, MAX_ALLOWANCE],
  });

  const {
    data: writeContractResult,
    writeAsync: approveAsync,
    error,
  } = useContractWrite(config);

  const { isLoading: isApproving } = useWaitForTransaction({
    hash: writeContractResult ? writeContractResult.hash : undefined,
    onSuccess(data) {
      refetch();
    },
    onError(data) {
      console.log(data);
    },
  });

  if (error) {
    return (
      <Typography className="unknown-price" textAlign={'right'}>
        Approving Error <WarningAmberIcon></WarningAmberIcon>
      </Typography>
    );
  }

  if (allowance === 0n && approveAsync) {
    return (
      <LoadingButton
        loading={isApproving}
        variant="contained"
        fullWidth
        onClick={async () => {
          const writtenValue = await approveAsync();
        }}
      >
        Approve
      </LoadingButton>
    );
  }
  return (
    <Button
      type="button"
      variant="contained"
      fullWidth
      onClick={onClick}
      className="swap-button"
    >
      Review Trade
    </Button>
  );
}
