import '@/styles/globals.scss';
import '@rainbow-me/rainbowkit/styles.css';
// import 'tw-elements/dist/css/tw-elements.min.css';

import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
} from '@rainbow-me/rainbowkit';
import { configureChains, WagmiConfig, createConfig } from 'wagmi';
import { base } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

import { ThemeProvider } from '@mui/material/styles';
import { theme } from '@/styles/theme';
import { ToastContainer } from 'react-toastify';

import TradeContext from '@/context/swapContext';
import 'react-toastify/dist/ReactToastify.css';

const { chains, publicClient } = configureChains(
  [base],
  [
    alchemyProvider({
      apiKey: process.env.ALCHEMY_ID || '86wTK178jC4XNO9sh-iVI7P5fV1tg_Dx',
    }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'Base Swap',
  projectId: '85ea32d265dfc865d0672c8b6b5c53d2',
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});
/*
 * Wrapping the app with WAGMI and Rainbowkit Provider
 */

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains} theme={darkTheme()}>
          <TradeContext>
            <Component {...pageProps} />
          </TradeContext>
          <ToastContainer />
        </RainbowKitProvider>
      </WagmiConfig>
    </ThemeProvider>
  );
}

export default MyApp;
