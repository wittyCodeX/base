import React from 'react';
import Link from 'next/link';
import TwitterIcon from '@mui/icons-material/Twitter';
import GitHubIcon from '@mui/icons-material/GitHub';
import TelegramIcon from '@mui/icons-material/Telegram';
import { TelegramLink, GithubLink, TwitterLink } from '@/config/config';
const Footer = () => {
  return (
    <>
      <footer className="footer-wrapper">
        <div>@ {new Date().getFullYear()} XYXY Finance</div>
        <div className="social-links">
          <Link href={TwitterLink} target="_blank">
            <TwitterIcon className="social-link" />
          </Link>
          <Link href={GithubLink} target="_blank">
            <GitHubIcon className="social-link" />
          </Link>
          <Link href={TelegramLink} target="_blank">
            <TelegramIcon className="social-link" />
          </Link>
        </div>
      </footer>
    </>
  );
};

export default Footer;
