import React from 'react';
import styled from 'styled-components';
import { contracts } from '../config/contracts';
import { ETH_NETWORK } from '../provider/connectors';

const FooterWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    padding: 24px 0px 32px;
    color: var(--footer-text-gray);
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
    :hover {
        filter: invert(48%) sepia(13%) saturate(281%) hue-rotate(154deg)
            brightness(97%) contrast(86%);
    }
`;

const Footer = ({}) => {
    const gitHash = process.env.REACT_APP_GIT_SHA.toString().substring(0, 7);
    return (
        <FooterWrapper>
            <LeftFooter>
                <FooterItem>
                    <a
                        href={
                            'https://github.com/levelkdev/BC-DAPP/tree/' +
                            process.env.REACT_APP_GIT_SHA
                        }
                        target="#"
                    >
                        Version 0.1.0
                    </a>
                </FooterItem>
                <FooterDivider></FooterDivider>
                <FooterItem>
                    <a
                        href={
                            'https://' +
                            ETH_NETWORK +
                            '.etherscan.io/address/' +
                            contracts[ETH_NETWORK].DAT
                        }
                        target="#"
                    >
                        Proxy
                    </a>
                </FooterItem>
                <FooterDivider></FooterDivider>
                <FooterItem>
                    <a
                        href={
                            'https://' +
                            ETH_NETWORK +
                            '.etherscan.io/address/' +
                            contracts[ETH_NETWORK].DATinfo.implementationAddress
                        }
                        target="#"
                    >
                        Contract
                    </a>
                </FooterItem>
                <FooterDivider></FooterDivider>
                <FooterItem>
                    <a href="https://daotalk.org/c/daos/dx-dao" target="#">
                        Forum
                    </a>
                </FooterItem>
                <FooterDivider></FooterDivider>
                <FooterItem>
                    <a
                        href="https://alchemy.daostack.io/dao/0x519b70055af55a007110b4ff99b0ea33071c720a"
                        target="#"
                    >
                        Alchemy
                    </a>
                </FooterItem>
            </LeftFooter>
            <RighFooter>
                <LogoWrapper>
                    <a href="https://twitter.com/dxdao_" target="#">
                        <FooterLogo src="twitter.svg"></FooterLogo>
                    </a>
                </LogoWrapper>
                <LogoWrapper>
                    <a href="https://www.reddit.com/r/dxdao/" target="#">
                        <FooterLogo src="reddit.svg"></FooterLogo>
                    </a>
                </LogoWrapper>
                <LogoWrapper>
                    <a href="https://t.me/dxDAO" target="#">
                        <FooterLogo src="telegram.svg"></FooterLogo>
                    </a>
                </LogoWrapper>
            </RighFooter>
        </FooterWrapper>
    );
};

export default Footer;
