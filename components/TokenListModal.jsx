import React, { useState, useEffect, useContext } from 'react';
import {
  Typography,
  Box,
  Modal,
  InputBase,
  Grid,
  Button,
  Container,
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import CloseIcon from '@mui/icons-material/Close';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Scrollbars } from 'rc-scrollbars';
import TokenList from '@uniswap/default-token-list/build/uniswap-default.tokenlist.json';
import { NativeCurrency, BASE_LIST } from '@/config/config';
import TokenBalance from '@/components/TokenBalance';
import { SwapContext } from '@/context/swapContext';
import Image from 'next/image';
import LoadingSVG from '@/loading.svg';

import { isAddress } from '@/libs/utils';

import { erc20ABI } from 'wagmi';
import { ethers } from 'ethers';

const TokenListModal = ({ setToken, modalOpen, closeModal, modalKey }) => {
  const [tokenList, setTokenList] = useState();
  const [search, setSearch] = useState('');
  const [tokens, setTokens] = useState();
  const [allChainTokens, setAllChainTokens] = useState();
  const [popularTokens, setPopularTokens] = useState();
  const [newToken, setNewToken] = useState('');
  const [newTokenModal, setNewTokenModal] = useState(false);
  const [newTokenState, setNewTokenState] = useState(true);

  const { fromToken, toToken, provider } = useContext(SwapContext);

  const closeNewTokenModal = () => {
    setNewTokenModal(false);
    setNewTokenState(true);
  };

  const handleSearch = (e) => {
    const keyword = e.target.value;
    setSearch(keyword);
    if (e.keyCode === 13) {
      if (search == '') {
        setTokenList(tokens);
      } else {
        const filtered = tokens.filter((token, index) => {
          return (
            token.symbol.toLowerCase().indexOf(keyword.toLowerCase()) > -1 ||
            token.address.toLowerCase().indexOf(keyword.toLowerCase()) > -1
          );
        });
        if (filtered.length > 0) {
          setTokenList(filtered);
        } else {
          const filteredAll = allChainTokens.filter((token, index) => {
            return (
              token.symbol.toLowerCase().indexOf(keyword.toLowerCase()) > -1 ||
              token.address.toLowerCase().indexOf(keyword.toLowerCase()) > -1
            );
          });
          if (filteredAll.length > 0) {
            setTokenList(filteredAll);
          } else {
            const formattedAddress = isAddress(e.target.value);
            if (formattedAddress) addToken(formattedAddress);
          }
        }
      }
    } else {
      const filtered = tokens.filter((token, index) => {
        return (
          token.symbol.toLowerCase().indexOf(keyword.toLowerCase()) > -1 ||
          token.address.toLowerCase().indexOf(keyword.toLowerCase()) > -1
        );
      });
      if (filtered.length > 0) {
        setTokenList(filtered);
      } else {
        const filteredAll = allChainTokens.filter((token, index) => {
          return (
            token.symbol.toLowerCase().indexOf(keyword.toLowerCase()) > -1 ||
            token.address.toLowerCase().indexOf(keyword.toLowerCase()) > -1
          );
        });

        if (filteredAll.length > 0) {
          setTokenList(filteredAll);
        } else {
          const formattedAddress = isAddress(e.target.value);
          if (formattedAddress) addToken(formattedAddress);
        }
      }
    }
  };

  const addToken = async (address) => {
    setNewTokenModal(true);
    try {
      const tokenContract = new ethers.Contract(address, erc20ABI, provider);
      const name = await tokenContract.name();
      const symbol = await tokenContract.symbol();
      const decimals = await tokenContract.decimals();

      const newToken = {
        chainId: 8453,
        address: address,
        name: name,
        symbol: symbol,
        decimals: decimals,
        logoURI: 'unknown',
        isNative: false,
      };
      setNewToken(newToken);
    } catch (e) {
      console.log(e);
      setNewTokenState(false);
    }
  };

  const importToken = () => {
    if (newToken) {
      setTokenList([newToken]);
      closeNewTokenModal();
    }
  };

  const handleSelect = (item) => {
    if (item === fromToken || item === toToken) {
    } else {
      setToken(item);
    }
    closeModal();
  };

  async function fetchInActiveTokens() {
    const response = await fetch(BASE_LIST);
    const res = await response.json();
    if (res && res.tokens) {
      const allTokensOnChain = res.tokens.filter(
        (token) => token.chainId === 8453
      );
      setTokens([NativeCurrency, ...allTokensOnChain]);
      const weth = allTokensOnChain.filter((item) => item.symbol === 'WETH');
      const usdc = allTokensOnChain.filter((item) => item.symbol === 'USDbC');
      setAllChainTokens(allTokensOnChain);
      setTokenList([NativeCurrency, ...allTokensOnChain]);
      setPopularTokens([NativeCurrency, weth[0], usdc[0]]);
    }
  }

  useEffect(() => {
    fetchInActiveTokens();
  }, []);

  return (
    <>
      <Modal
        open={modalOpen}
        onClose={closeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="tokenSelectModalBox">
          <Grid
            justifyContent={'space-between'}
            container
            alignItems={'center'}
          >
            <Typography variant="h6" component="h2" color={'white'}>
              Select a Token
            </Typography>
            <CloseIcon onClick={closeModal} className="close-button" />
          </Grid>
          <Grid className="search-box">
            <InputBase
              placeholder="Search token name or address"
              onKeyUp={(e) => handleSearch(e)}
              fullWidth={true}
            />
            <SearchOutlinedIcon className="search-icon" />
          </Grid>
          <Grid className="popularTokens">
            {popularTokens && popularTokens.length > 0 ? (
              popularTokens.map((token, index) =>
                (fromToken.symbol === token?.symbol && modalKey === 'buy') ||
                (toToken.symbol === token?.symbol && modalKey === 'sell') ? (
                  <div key={index} className="popular-item disabled">
                    <Grid
                      item
                      alignItems={'center'}
                      justifyContent={'center'}
                      display={'flex'}
                    >
                      <img
                        src={token?.logoURI}
                        alt="icon"
                        className={'token-icon'}
                      />
                      {token?.name}
                    </Grid>
                  </div>
                ) : (
                  <div
                    key={index}
                    className="popular-item"
                    onClick={() => handleSelect(token)}
                  >
                    <Grid
                      item
                      alignItems={'center'}
                      justifyContent={'center'}
                      display={'flex'}
                    >
                      <img
                        src={token?.logoURI}
                        alt="icon"
                        className={' token-icon'}
                      />
                      {token?.name}
                    </Grid>
                  </div>
                )
              )
            ) : (
              <></>
            )}
          </Grid>
          <hr />
          <Container>
            <Grid container direction="column">
              <Scrollbars
                style={{ height: 300 }}
                autoHide
                autoHideTimeout={1000}
                autoHideDuration={200}
              >
                {tokenList &&
                  tokenList.map((items, index) => {
                    return (
                      <React.Fragment key={index}>
                        {(fromToken.symbol === items.symbol &&
                          modalKey === 'buy') ||
                        (toToken.symbol === items.symbol &&
                          modalKey === 'sell') ? (
                          <Grid
                            item
                            container
                            key={index}
                            className="token-item disabled"
                            justifyContent={'space-between'}
                            alignItems={'center'}
                            padding={'2rem'}
                          >
                            <Grid
                              item
                              alignItems={'center'}
                              justifyContent={'center'}
                              display={'flex'}
                            >
                              {items.logoURI !== 'unknown' ? (
                                <img
                                  src={items.logoURI}
                                  alt="icon"
                                  className="token-icon"
                                />
                              ) : (
                                <div>?</div>
                              )}

                              {items.symbol}
                            </Grid>
                            <TokenBalance token={items} />
                          </Grid>
                        ) : (
                          <Grid
                            item
                            container
                            key={index}
                            className="token-item"
                            onClick={() => handleSelect(items)}
                            justifyContent={'space-between'}
                            alignItems={'center'}
                          >
                            <Grid
                              item
                              alignItems={'center'}
                              justifyContent={'center'}
                              display={'flex'}
                            >
                              {items.logoURI !== 'unknown' ? (
                                <img
                                  src={items.logoURI}
                                  alt="icon"
                                  className="token-icon"
                                />
                              ) : (
                                <div className="unknown-logo">?</div>
                              )}
                              {items.symbol}
                            </Grid>

                            <TokenBalance token={items} />
                          </Grid>
                        )}
                      </React.Fragment>
                    );
                  })}
              </Scrollbars>
            </Grid>
          </Container>
        </Box>
      </Modal>

      <Modal
        open={newTokenModal}
        onClose={closeNewTokenModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="tokenSelectModalBox">
          {newToken && newTokenState ? (
            <>
              {' '}
              <Grid
                justifyContent={'space-between'}
                container
                alignItems={'center'}
              >
                <Typography variant="h6" component="h2" color={'white'}>
                  Import Token
                </Typography>
                <CloseIcon
                  onClick={closeNewTokenModal}
                  className="close-button"
                />
              </Grid>
              <Grid
                marginTop={'12px'}
                backgroundColor={'#0e1d4ade'}
                padding={'12px'}
                borderRadius={'6px'}
                display={'flex'}
                direction={'column'}
                justifyContent={'center'}
                alignContent={'center'}
              >
                <WarningIcon
                  fontSize="large"
                  sx={{ color: 'yellow', margin: '0 auto', padding: '10px' }}
                />
                <Typography color={'white'} fontSize={'15px'} align={'center'}>
                  This token isn't traded on leading U.S. centralized exchanges
                  or frequently swapped on Uniswap.
                </Typography>
              </Grid>
              <Grid item padding={'8px'}>
                <Typography color={'white'} sx={{ marginTop: '8px' }}>
                  {newToken?.name} {'  '}( {newToken?.symbol} )
                </Typography>
              </Grid>
              <Grid item padding={'8px'}>
                <Typography color={'white'} sx={{ marginTop: '8px' }}>
                  {newToken?.address}
                </Typography>
              </Grid>
              <Grid item padding={'5px'}>
                <a href={`https://basescan.org/address/${newToken?.address}`}>
                  View on explorer
                </a>
              </Grid>
              <Button
                variant="contained"
                fullWidth
                sx={{ marginTop: '12px' }}
                onClick={() => importToken()}
              >
                I understand & Import Token
              </Button>
            </>
          ) : (
            <>
              {newTokenState ? (
                <>
                  <Grid
                    marginTop={'12px'}
                    padding={'12px'}
                    borderRadius={'6px'}
                    display={'flex'}
                    justifyContent={'center'}
                  >
                    <Image
                      src={LoadingSVG}
                      alt="Loading..."
                      layout="fixed"
                      width={40}
                      height={40}
                    />
                    <Typography
                      color={'white'}
                      sx={{ marginTop: '8px', textAlign: 'center' }}
                    >
                      Searching token...
                    </Typography>
                  </Grid>
                </>
              ) : (
                <>
                  <Grid
                    justifyContent={'space-between'}
                    container
                    alignItems={'center'}
                  >
                    <div></div>
                    <CloseIcon
                      onClick={closeNewTokenModal}
                      className="close-button"
                    />
                  </Grid>
                  <Grid
                    padding={'12px'}
                    borderRadius={'6px'}
                    display={'flex'}
                    justifyContent={'center'}
                  >
                    <Typography
                      color={'white'}
                      sx={{ marginTop: '8px', textAlign: 'center' }}
                    >
                      There is no the token on Chain
                    </Typography>
                  </Grid>
                </>
              )}
            </>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default TokenListModal;
