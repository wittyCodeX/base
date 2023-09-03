import ms from 'ms';

export const API_URL = 'https://base.api.0x.org';
export const ExchangeProxyAddress =
  '0xdef1c0ded9bec7f1a1670819833240f027b25eff';

export const DEFILIAMA_URL = 'https://api.llama.fi';

export const MAX_ALLOWANCE =
  115792089237316195423570985008687907853269984665640564039457584007913129639935n;

export const SERVICE_PROVIDER = '0x600bE5FcB9338BC3938e4790EFBeAaa4F77D6893';
export const XYXY_address = '0xFc5f2B58249d31a06d2F30E69F7b7839d4b88c4a';
export const xyxyPresaleContractAddress =
  '0xfC633918BFB8C29ecB14E3Ab1dC61099C76605de';
export const XYXY_DECIMALS = 18;

export const NFT_API_KEY = process.env.NFT_API_KEY || '0vRGdBdsof06m2vFAGZsUUgq5J8GUamGoW1JZzgbg3QlenVl'
export const COVALENTHQ_API = process.env.COVALENTHQ_API || 'cqt_rQjGCrjGhbfcxrdbkfKMr6ypg9Gv'
export const ZEROX_API_KEY = process.env.ZEROX_API_KEY || 'b1f0b280-cc00-4edf-97b1-34491e6e7354'  // 'c9f13c84-9fcb-4f42-aa30-a11b0d016aa5'
export const TelegramLink = process.env.TELEGRAM || '';
export const GithubLink = process.env.GITHUB || '';
export const DiscordLink = process.env.DISCORD || '';
export const TwitterLink = process.env.TWITTER || '';

export const HeaderLinks = [
  {
    name: 'Swap',
    link: '/',
  },
  {
    name: 'Stats',
    link: '/stats',
  },
  {
    name: 'IDO',
    link: '/ido',
  },
  // {
  //   name: 'Launchpad',
  //   link: '/launchpad',
  // },
  // {
  //   name: 'Leaderboard',
  //   link: '/leaderboard',
  // },
  {
    name: 'Nodes',
    link: '/nodesale',
  },
];
export const DEFAULT_ERC20_DECIMALS = 18
export const UNKNOWN_TOKEN_SYMBOL = 'UNKNOWN'
export const UNKNOWN_TOKEN_NAME = 'Unknown Token'
export const BASE_LIST =
  'https://raw.githubusercontent.com/ethereum-optimism/ethereum-optimism.github.io/master/optimism.tokenlist.json'

export const POOL_FACTORY_CONTRACT_ADDRESS =
  '0x33128a8fC17869897dcE68Ed026d694621f6FDfD'
export const QUOTER_CONTRACT_ADDRESS =
  '0x3d4e44Eb1374240CE5F1B871ab261CD16335B76a'
export const V3_SWAP_ROUTER_ADDRESS = '0x2626664c2603336E57B271c5C0b26F421741e481'
export const WETH_CONTRACT_ADDRESS =
  '0x4200000000000000000000000000000000000006'

// ABI's

export const ERC20_ABI = [
  // Read-Only Functions
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',

  // Authenticated Functions
  'function transfer(address to, uint amount) returns (bool)',
  'function approve(address _spender, uint256 _value) returns (bool)',

  // Events
  'event Transfer(address indexed from, address indexed to, uint amount)',
]

export const ERC20_BYTES32_ABI = [
  {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "name": "",
        "type": "bytes32"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "name": "",
        "type": "bytes32"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
]


export const WETH_ABI = [
  // Wrap ETH
  'function deposit() payable',

  // Unwrap ETH
  'function withdraw(uint wad) public',
]
export const AVERAGE_L1_BLOCK_TIME = ms(`12s`)

export const PERMIT2_APPROVE_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "allowance",
    "outputs": [
      {
        "internalType": "uint160",
        "name": "amount",
        "type": "uint160"
      },
      {
        "internalType": "uint48",
        "name": "expiration",
        "type": "uint48"
      },
      {
        "internalType": "uint48",
        "name": "nonce",
        "type": "uint48"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

// Transactions

export const MAX_FEE_PER_GAS = 1000000000
export const MAX_PRIORITY_FEE_PER_GAS = 100000000
export const TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER = 2000

export const TransactionState = {
  Failed: 'Failed',
  New: 'New',
  Rejected: 'Rejected',
  Sending: 'Sending',
  Sent: 'Sent',
}
export const NativeCurrency = {
  "address": "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
  "chainId": 8453,
  "decimals": 18,
  "logoURI": "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
  "symbol": "ETH",
  "name": "ETH",
  "isNative": true
}