import React from 'react';
import styled from 'styled-components';
import { contracts } from '../config/contracts';
import { DEFAULT_ETH_NETWORK } from '../provider/connectors';
import { etherscanAddress, etherscanToken } from 'utils/etherscan';
import { useStores } from '../contexts/storesContext';

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

const Footer = () => {
    const {
        root: {providerStore},
    } = useStores();

    let chainId = providerStore.getActiveWeb3React().chainId;
    let proxyContract = contracts[DEFAULT_ETH_NETWORK].DAT;
    let contract = contracts[DEFAULT_ETH_NETWORK].implementationAddress;
    return (
        <FooterWrapper>
            <LeftFooter>
                <FooterItem>
                    <a
                        href={
                          'https://github.com/levelkdev/openraise-dapp/tree/v0.2.2'
                        }
                        target="#"
                    >
                        Version 0.2.2
                    </a>
                </FooterItem>
                <FooterDivider></FooterDivider>
                <FooterItem>
                    {etherscanToken(chainId,"Token Contract",proxyContract, false)}
                </FooterItem>
                <FooterDivider></FooterDivider>
                <FooterItem>
                    {etherscanAddress(chainId,"Logic Contract",contract)}
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
                <FooterDivider></FooterDivider>
                <FooterItem>
                    <a
                        href="https://dxdao.eth.link/#/faq"
                        target="#"
                    >
                        FAQ
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
