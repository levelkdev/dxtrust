import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import styled from 'styled-components';
import links from '../../links';

const FooterWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    padding: 20px 0px 50px 0px;
    color: var(--footer-text-gray);
    border-top: 1px solid var(--footer-divider);
    margin-top: 124px;
    @media (max-width: 768px) {
        padding: 20px 0px;
    }
`;

const LeftFooter = styled.div`
    display: flex;
    flex-direction: row;
`;

const RighFooter = styled.div`
    display: flex;
    flex-direction: row;
`;

const FooterItem = styled.div`
    a {
        text-decoration: none;
        color: var(--footer-text-gray);
    }
    a:hover {
        color: var(--text-gray-onHover);
    }a
    
`;

const FooterDivider = styled.div`
    background: var(--footer-text-gray);
    width: 4px;
    height: 4px;
    border-radius: 2px;
    line-height: 24px;
    margin: 7px;
`;

const LogoWrapper = styled.div`
    padding-left: 8px;
`;

const FooterLogo = styled.img``;

const Footer = () => {
    return (
        <FooterWrapper>
            <LeftFooter>
                <FooterItem>
                    <a href={links.footer_version} target="#">
                        Version: {process.env.REACT_APP_VERSION}
                    </a>
                </FooterItem>
                <FooterDivider></FooterDivider>
                <FooterItem>
                    <a href={links.footer_git_hash} target="#">
                        Git Hash
                    </a>
                </FooterItem>
                <FooterDivider></FooterDivider>
                <FooterItem>
                    <Link to="/brand-assets">Brand Assets</Link>
                </FooterItem>
            </LeftFooter>
            <RighFooter>
                <LogoWrapper>
                    <a href={links.footer_twitter} target="#">
                        <FooterLogo src="twitter_color.svg"></FooterLogo>
                    </a>
                </LogoWrapper>
                <LogoWrapper>
                    <a href={links.footer_reddit} target="#">
                        <FooterLogo src="reddit_color.svg"></FooterLogo>
                    </a>
                </LogoWrapper>
                <LogoWrapper>
                    <a href={links.footer_telegram} target="#">
                        <FooterLogo src="telegram_color.svg"></FooterLogo>
                    </a>
                </LogoWrapper>
            </RighFooter>
        </FooterWrapper>
    );
};

export default Footer;
