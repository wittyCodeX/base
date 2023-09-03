import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import {
  Container,
  Grid,
  Button,
  Menu,
  MenuItem,
  useMediaQuery,
} from '@mui/material';

import { useRouter } from 'next/router';
import Image from 'next/image';
// import { db } from '@/config/firebase';
// import { onValue, ref, query, orderByChild, equalTo } from 'firebase/database';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Logo from '@/logo_new.png';
import { HeaderLinks } from '@/config/config';
// import { convertCurrency } from '@/libs/utils';
import { useAccount } from 'wagmi';
const Header = () => {
  const router = useRouter();
  const [anchorEl1, setAnchorEl1] = useState(null);
  const [addr, setAddr] = useState(null);
  const [connected, setConnected] = useState(false);

  const mobileMenuOpen = Boolean(anchorEl1);
  const matches = useMediaQuery('(min-width: 901px )');

  const { isConnected, address } = useAccount();

  useEffect(() => {
    setConnected(isConnected);
  }, [isConnected]);

  useEffect(() => {
    setAddr(addr);
  }, [address]);

  // useEffect(() => {
  //   if (address) {
  //     const dbQuery = query(
  //       ref(db, 'histories'),
  //       orderByChild('address'),
  //       equalTo(address)
  //     );
  //     onValue(dbQuery, (snapshot) => {
  //       const returned = snapshot.val();

  //       if (snapshot.exists() && returned) {
  //         const values = Object.values(returned);
  //         let totalXP = 0;
  //         values.map((x) => {
  //           return (totalXP += Number(x.newXP || 0)).toFixed(2);
  //         });
  //         setMyXP(convertCurrency(totalXP));
  //       }
  //     });
  //   }
  // }, [address]);
  return (
    <Grid className="navbar">
      <Container maxWidth={'fixed'}>
        <Grid className="header">
          <Grid item className="header-logo">
            <Image
              src={Logo}
              alt="XYXY logo"
              layout="fixed"
              className="site-logo"
              width={70}
              height={70}
            />
            XYXY.IO
          </Grid>
          <Grid
            xs={4}
            md={4}
            sx={{ display: { xs: 'none', md: 'block' } }}
            item
          >
            <Grid container justifyContent={'center'}>
              <Grid className="nav-group">
                {HeaderLinks.map((item, index) => (
                  <Link href={item.link} key={index}>
                    <div
                      className={
                        router.asPath === item.link
                          ? 'nav-link active'
                          : 'nav-link'
                      }
                    >
                      {item.name}
                    </div>
                  </Link>
                ))}
              </Grid>
            </Grid>
          </Grid>
          <Grid xs={10} md={4} item>
            <Grid container justifyContent="flex-end" alignItems={'center'}>
              {/* {connected ? (
                <Link href="/profile" className="right-4 rounded-xl  p-2 ">
                  <span className="xp">{myXP} XP</span>
                </Link>
              ) : (
                ''
              )} */}
              {matches && (
                <ConnectButton
                  showBalance={{
                    smallScreen: false,
                    largeScreen: true,
                  }}
                  className="wallet-connect"
                />
              )}
              <Button id="dropdown">
                <MenuOutlinedIcon
                  className="mobile-menu"
                  onClick={(e) => setAnchorEl1(e.target)}
                ></MenuOutlinedIcon>
              </Button>
              <Menu
                id="dropdownMenu"
                anchorEl={anchorEl1}
                open={mobileMenuOpen}
                onClose={() => setAnchorEl1(null)}
                MenuListProps={{
                  'aria-labelledby': 'dropdown',
                }}
              >
                {HeaderLinks.map((item, index) => {
                  return (
                    <MenuItem key={index}>
                      <Link href={item.link} key={index}>
                        <div
                          className={
                            router.asPath === item.link
                              ? 'nav-link active'
                              : 'nav-link'
                          }
                        >
                          {item.name}
                        </div>
                      </Link>
                    </MenuItem>
                  );
                })}
                {!matches && (
                  <MenuItem>
                    <ConnectButton
                      showBalance={{
                        smallScreen: false,
                        largeScreen: true,
                      }}
                      className="wallet-connect"
                    />
                  </MenuItem>
                )}
              </Menu>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Grid>
  );
};

export default Header;
