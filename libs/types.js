import { Trade } from '@uniswap/router-sdk'
import { Token, CurrencyAmount } from '@uniswap/sdk-core'
import { ExtendedEther } from '@uniswap/smart-order-router'
import { Pair, Route as V2Route } from '@uniswap/v2-sdk'
import { FeeAmount, Pool, Route as V3Route } from '@uniswap/v3-sdk'
import { MixedRouteSDK } from '@uniswap/router-sdk'

export class ClassicTrade extends Trade {
  fillType = 'classic'
  approveInfo
  gasUseEstimateUSD // gas estimate for swaps
  blockNumber
  isUniswapXBetter
  requestId
  quoteMethod

  constructor({
    gasUseEstimateUSD,
    blockNumber,
    isUniswapXBetter,
    requestId,
    quoteMethod,
    ...routes
  }) {
    super(routes)
    this.blockNumber = blockNumber
    this.gasUseEstimateUSD = gasUseEstimateUSD
    this.isUniswapXBetter = isUniswapXBetter
    this.requestId = requestId
    this.quoteMethod = quoteMethod
  }

  // gas estimate for maybe approve + swap
  get totalGasUseEstimateUSD() {
    return this.gasUseEstimateUSD
  }
}

export async function transformRoutesToTrade(
  args,
  data,
  quoteMethod
) {
  const { tradeType } = args

  // During the opt-in period, only return UniswapX quotes if the user has turned on the setting,
  // even if it is the better quote.
  const showUniswapXTrade = false

  const [currencyIn, currencyOut] = getTradeCurrencies(args, showUniswapXTrade)
  console.log(currencyIn)
  const { gasUseEstimateUSD, blockNumber, routes, gasUseEstimate } = getClassicTradeDetails(
    currencyIn,
    currencyOut,
    data
  )

  // If the top-level URA quote type is DUTCH_LIMIT, then UniswapX is better for the user
  const isUniswapXBetter = false

  // Some sus javascript float math but it's ok because its just an estimate for display purposes

  const classicTrade = new ClassicTrade({
    v2Routes:
      routes
        ?.filter((r) => r.routev2 !== null)
        .map(({ routev2, inputAmount, outputAmount }) => ({
          routev2,
          inputAmount,
          outputAmount,
        })) ?? [],
    v3Routes:
      routes
        ?.filter((r) => r.routev3 !== null)
        .map(({ routev3, inputAmount, outputAmount }) => ({
          routev3,
          inputAmount,
          outputAmount,
        })) ?? [],
    mixedRoutes:
      routes
        ?.filter(
          (r) => r.mixedRoute !== null
        )
        .map(({ mixedRoute, inputAmount, outputAmount }) => ({
          mixedRoute,
          inputAmount,
          outputAmount,
        })) ?? [],
    tradeType,
    gasUseEstimateUSD,
    blockNumber,
    isUniswapXBetter,
    requestId: data.quote.requestId,
    quoteMethod,
  })

  return { state: 'Success', trade: classicTrade }
}
export const SwapRouterNativeAssets = {
  MATIC: 'MATIC',
  BNB: 'BNB',
  AVAX: 'AVAX',
  ETH: 'ETH',
}
function getTradeCurrencies(args) {
  const {
    tokenInAddress,
    tokenInChainId,
    tokenInDecimals,
    tokenInSymbol,
    tokenOutAddress,
    tokenOutChainId,
    tokenOutDecimals,
    tokenOutSymbol,
  } = args

  const tokenInIsNative = Object.values(SwapRouterNativeAssets).includes(tokenInAddress)
  const tokenOutIsNative = Object.values(SwapRouterNativeAssets).includes(tokenOutAddress)

  const currencyIn = tokenInIsNative
    ? nativeOnChain(tokenInChainId)
    : parseToken({ address: tokenInAddress, chainId: tokenInChainId, decimals: tokenInDecimals, symbol: tokenInSymbol })
  const currencyOut = tokenOutIsNative
    ? nativeOnChain(tokenOutChainId)
    : parseToken({
      address: tokenOutAddress,
      chainId: tokenOutChainId,
      decimals: tokenOutDecimals,
      symbol: tokenOutSymbol,
    })
  return [currencyIn, currencyOut]
}
function parseToken({ address, chainId, decimals, symbol }) {
  return new Token(chainId, address, parseInt(decimals.toString()), symbol)
}

export function nativeOnChain(chainId) {
  let nativeCurrency = new ExtendedEther(chainId)
  return nativeCurrency
}
function getClassicTradeDetails(
  currencyIn,
  currencyOut,
  data
) {
  const classicQuote =
    data.routing === 'CLASSIC' ? data.quote : data.allQuotes.find(isClassicQuoteResponse)?.quote
  return {
    gasUseEstimate: classicQuote?.gasUseEstimate ? parseFloat(classicQuote.gasUseEstimate) : undefined,
    gasUseEstimateUSD: classicQuote?.gasUseEstimateUSD ? parseFloat(classicQuote.gasUseEstimateUSD) : undefined,
    blockNumber: classicQuote?.blockNumber,
    routes: classicQuote ? computeRoutes(currencyIn, currencyOut, classicQuote.route) : undefined,
  }
}

/**
 * Transforms a Routing API quote into an array of routes that can be used to
 * create a `Trade`.
 */
export function computeRoutes(
  currencyIn,
  currencyOut,
  routes
) {
  if (routes.length === 0) return []

  const tokenIn = routes[0]?.[0]?.tokenIn
  const tokenOut = routes[0]?.[routes[0]?.length - 1]?.tokenOut
  if (!tokenIn || !tokenOut) throw new Error('Expected both tokenIn and tokenOut to be present')

  try {
    return routes.map((route) => {
      if (route.length === 0) {
        throw new Error('Expected route to have at least one pair or pool')
      }
      const rawAmountIn = route[0].amountIn
      const rawAmountOut = route[route.length - 1].amountOut

      if (!rawAmountIn || !rawAmountOut) {
        throw new Error('Expected both amountIn and amountOut to be present')
      }

      const isOnlyV2 = isVersionedRoute('v2-pool', route)
      const isOnlyV3 = isVersionedRoute('v3-pool', route)

      return {
        routev3: isOnlyV3 ? new V3Route(route.map(parsePool), currencyIn, currencyOut) : null,
        routev2: isOnlyV2 ? new V2Route(route.map(parsePair), currencyIn, currencyOut) : null,
        mixedRoute:
          !isOnlyV3 && !isOnlyV2 ? new MixedRouteSDK(route.map(parsePoolOrPair), currencyIn, currencyOut) : null,
        inputAmount: CurrencyAmount.fromRawAmount(currencyIn, rawAmountIn),
        outputAmount: CurrencyAmount.fromRawAmount(currencyOut, rawAmountOut),
      }
    })
  } catch (e) {
    console.error('Error computing routes', e)
    return
  }
}
function isVersionedRoute(
  type,
  route
) {
  return route.every((pool) => pool.type === type)
}

export function isClassicQuoteResponse(data) {
  return data.routing === 'CLASSIC'
}
const parsePoolOrPair = (pool) => {
  return pool.type === 'v3-pool' ? parsePool(pool) : parsePair(pool)
}

function parsePool({ fee, sqrtRatioX96, liquidity, tickCurrent, tokenIn, tokenOut }) {
  return new Pool(
    parseToken(tokenIn),
    parseToken(tokenOut),
    parseInt(fee),
    sqrtRatioX96,
    liquidity,
    parseInt(tickCurrent)
  )
}

const parsePair = ({ reserve0, reserve1 }) =>
  new Pair(
    CurrencyAmount.fromRawAmount(parseToken(reserve0.token), reserve0.quotient),
    CurrencyAmount.fromRawAmount(parseToken(reserve1.token), reserve1.quotient)
  )