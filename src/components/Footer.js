import React from 'react';
import styled from 'styled-components';
import { contracts } from '../config/contracts';
import { ETH_NETWORK } from '../provider/connectors';

const FooterWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    padding: 50px 0px 50px 0px;
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

const Telegram = styled.div`
    display: inline-block;
    width: 20px;
    height: 20px;
    background-size: cover;
    background: url(telegram.svg);

    &:hover {
        background: url(telegram-onHover.svg);
    }
`;

const Reddit = styled.div`
    display: inline-block;
    width: 20px;
    height: 20px;
    background-size: cover;
    background: url(reddit.svg);

    &:hover {
        background: url(reddit-onHover.svg);
    }   
`;

const Twitter = styled.div`
    display: inline-block;
    width: 20px;
    height: 20px;
    background-size: cover;
    background: url(twitter.svg);

    &:hover {
        background: url(twitter-onHover.svg);
    }   
`;

const Footer = ({}) => {
  console.log(process.env)
    const gitHash = process.env.REACT_APP_GIT_SHA.toString().substring(0,7);
    return (
        <FooterWrapper>
            <LeftFooter>
                <FooterItem>
                    <a
                        href={"https://github.com/levelkdev/BC-DAPP/tree/"+process.env.REACT_APP_GIT_SHA}
                        target="#"
                    >
                        DXdao Version {gitHash} - v0.1.0
                    </a>
                </FooterItem>
                <FooterDivider></FooterDivider>
                <FooterItem>
                    <a
                        href={"https://"+ETH_NETWORK+".etherscan.io/address/"+contracts[ETH_NETWORK].DAT}
                        target="#"
                    >
                        Proxy
                    </a>
                </FooterItem>
                <FooterDivider></FooterDivider>
                <FooterItem>
                    <a
                        href={"https://"+ETH_NETWORK+".etherscan.io/address/"+contracts[ETH_NETWORK].DATinfo.implementationAddress}
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
                        <Twitter></Twitter>
                    </a>
                </LogoWrapper>
                <LogoWrapper>
                    <a href="https://www.reddit.com/r/dxdao/" target="#">
                        <Reddit></Reddit>
                    </a>
                </LogoWrapper>
                <LogoWrapper>
                    <a href="https://t.me/dxDAO" target="#">
                        <Telegram></Telegram>
                    </a>
                </LogoWrapper>
            </RighFooter>
        </FooterWrapper>
    );
};

export default Footer;
