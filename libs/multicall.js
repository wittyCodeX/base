// import { useWeb3React } from '@web3-react/core'
// import useBlockNumber from '@/hooks/useBlockNumber'
// import multicall from 'lib/state/multicall'

// export { NEVER_RELOAD } from '@uniswap/redux-multicall' // re-export for convenience

// export function useSingleCallResult(...args) {
//   const { chainId, latestBlock } = useCallContext()
//   return multicall.hooks.useSingleCallResult(chainId, latestBlock, ...args)
// }


// function useCallContext() {
//   const { chainId } = useWeb3React()
//   const latestBlock = useBlockNumber()
//   return { chainId, latestBlock }
// }