import React from 'react';
import styled from 'styled-components';

const FooterWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    padding: 20px 0px 50px 0px;
    color: var(--footer-text-gray);
    border-top: 1px solid var(--footer-divider);
    margin-top: 124px;
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
    width: 20px;
    padding-left: 8px;
`;

const FooterLogo = styled.img`
`;

const Footer = () => {
    return (
        <FooterWrapper>
            <LeftFooter>
                <FooterItem>
                    <a
                        href={
                            'https://github.com/levelkdev/BC-DAPP/tree/v0.2.0'
                        }
                        target="#"
                    >
                        Version 0.2.0
                    </a>
                </FooterItem>
                <FooterDivider></FooterDivider>
                <FooterItem>
                    <a
                        href={
                            'https://github.com/levelkdev/BC-DAPP/tree/' +
                            process.env.REACT_APP_GIT_SHA
                        }
                        target="#"
                    >
                        Git Hash
                    </a>
                </FooterItem>
            </LeftFooter>
            <RighFooter>
                <LogoWrapper>
                    <a href="https://twitter.com/dxdao_" target="#">
                        <FooterLogo src="twitter_color.svg"></FooterLogo>
                    </a>
                </LogoWrapper>
                <LogoWrapper>
                    <a href="https://www.reddit.com/r/dxdao/" target="#">
                        <FooterLogo src="reddit_color.svg"></FooterLogo>
                    </a>
                </LogoWrapper>
                <LogoWrapper>
                    <a href="https://t.me/dxDAO" target="#">
                        <FooterLogo src="telegram_color.svg"></FooterLogo>
                    </a>
                </LogoWrapper>
            </RighFooter>
        </FooterWrapper>
    );
};

export default Footer;
