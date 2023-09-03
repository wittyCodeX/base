import { BigNumber, ethers } from 'ethers';
import { getAddress } from '@ethersproject/address'
import { arrayify } from '@ethersproject/bytes'
import { parseBytes32String } from '@ethersproject/strings'

export function fromReadableAmount(amount, decimals) {
  if (!amount) return 0;
  return ethers.utils.parseUnits(amount.toString(), decimals).toString();
}

export function toReadableAmount(rawAmount, decimals) {
  if (!rawAmount) return 0;
  return Number(
    ethers.utils.formatUnits(BigNumber.from(rawAmount), decimals).toString()
  ).toFixed(5);
}
export const formatAddress = (address, segment) => {
  if (!address) return;
  return address.slice(0, segment) + '...' + address.slice(-segment);
};


export const convertCurrency = (labelValue) => {
  return Number(labelValue) >= 1.0e9
    ? (Number(labelValue) / 1.0e9).toFixed(2) + 'B'
    : Number(labelValue) >= 1.0e6
      ? (Number(labelValue) / 1.0e6).toFixed(2) + 'M'
      : Number(labelValue) >= 1.0e3
        ? (Number(labelValue) / 1.0e3).toFixed(2) + 'K'
        : Number(labelValue);
};

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value) {
  try {
    // Alphabetical letters must be made lowercase for getAddress to work.
    // See documentation here: https://docs.ethers.io/v5/api/utils/address/
    return getAddress(value.toLowerCase())
  } catch {
    return false
  }
}
const BYTES32_REGEX = /^0x[a-fA-F0-9]{64}$/

export function parseStringOrBytes32(str, bytes32, defaultValue) {
  return str && str.length > 0
    ? str
    : // need to check for proper bytes string and valid terminator
    bytes32 && BYTES32_REGEX.test(bytes32) && arrayify(bytes32)[31] === 0
      ? parseBytes32String(bytes32)
      : defaultValue
}

function getReason(error) {
  let reason
  while (error) {
    reason = error.reason ?? error.message ?? reason
    error = error.error ?? error.data?.originalError
  }
  return reason
}
export function didUserReject(error) {
  const reason = getReason(error)
  if (
    error?.code === 4001 ||
    // ethers v5.7.0 wrapped error
    error?.code === 'ACTION_REJECTED' ||
    // For Rainbow :
    (reason?.match(/request/i) && reason?.match(/reject/i)) ||
    // For Frame:
    reason?.match(/declined/i) ||
    // For SafePal:
    reason?.match(/cancell?ed by user/i) ||
    // For Trust:
    reason?.match(/user cancell?ed/i) ||
    // For Coinbase:
    reason?.match(/user denied/i) ||
    // For Fireblocks
    reason?.match(/user rejected/i) ||
    error instanceof UserRejectedRequestError
  ) {
    return true
  }
  return false
}
export class UserRejectedRequestError extends Error {
  constructor(message) {
    super(message)
    this.name = 'UserRejectedRequestError'
  }
}
export function isZero(hexNumberString) {
  return /^0x0*$/.test(hexNumberString)
}
export function calculateGasMargin(value) {
  return value.mul(120).div(100)
}