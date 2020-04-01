import React, { useState } from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import BuyForm from './Buy/BuyForm';
import EnableContinue from './common/EnableContinue';
import Enable from './common/Enable';
import EnablePending from './common/EnablePending';
import SellForm from './Sell/SellForm';
import { useStores } from '../contexts/storesContext';
import { formatBalance } from '../utils/token';

const BuySellWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 298px;
    margin-left: 24px;
    border: 1px solid var(--medium-gray);
    border-radius: 4px;
    background-color: white;
    justify-content: space-between;
`;

const TabWrapper = styled.div`
    display: flex;
    flex-direction: row;
`;

const ActiveTab = styled.div`
    color: var(--blue-text);
    width: 50%;
    text-align: center;
    border-left: ${(props) =>
        props.left ? '1px solid var(--medium-gray)' : 'none'};
    padding: 15px 0px;
    cursor: pointer;
`;

const InactiveTab = styled.div`
    color: var(--dark-text-gray);
    width: 50%;
    text-align: center;
    background-color: var(--light-gray);
    border-left: ${(props) =>
        props.left ? '1px solid var(--medium-gray)' : 'none'};
    border-bottom: 1px solid var(--medium-gray);
    border-radius: 0px 4px 0px 0px;
    padding: 15px 0px;
    cursor: pointer;
`;

const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    padding: 18px;
`;

const CryptoInfoWrapper = styled.div`
    height: 100px;
    padding-bottom: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    border-bottom: 1px solid var(--line-gray);
`;

const InfoRow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    line-height: 24px;
    color: var(--dark-text-gray);
`;

const DXDLogo = styled.img``;

const ETHLogo = styled.img``;

const LogoAndText = styled.div`
    display: flex;
    flex-direction: row;
`;

const LogoText = styled.div`
    margin-left: 10px;
    color: var(--light-text-gray);
`;

const BuySell = observer(() => {
    const {
        root: { tradingStore, providerStore, tokenStore, configStore },
    } = useStores();

    const { account } = providerStore.getActiveWeb3React();

    const [currentTab, setCurrentTab] = useState(0);

    const incrementTKN = tradingStore.enableTKNState;
    const incrementDXD = tradingStore.enableDXDState;

    let ETHBalance, DXDBalance = undefined;

    if (account) {
        ETHBalance = tokenStore.getBalance('ether', account);
        DXDBalance = tokenStore.getBalance(configStore.getDXDTokenAddress(), account);
        console.log('DXDBalance', DXDBalance ? DXDBalance.toString() : undefined);
    }

    const ETHBalanceDisplay = ETHBalance ? formatBalance(ETHBalance) : '0.000';
    const DXDBalanceDisplay = DXDBalance ? formatBalance(DXDBalance): '0.000';

    const TabButton = ({ currentTab, tabType, left, children }) => {
        if (currentTab === tabType) {
            return (
                <ActiveTab
                    onClick={() => {
                        setCurrentTab(tabType);
                    }}
                    left={left}
                >
                    {children}
                </ActiveTab>
            );
        } else {
            return (
                <InactiveTab
                    onClick={() => {
                        setCurrentTab(tabType);
                    }}
                    left={left}
                >
                    {children}
                </InactiveTab>
            );
        }
    };

    const CurrentForm = ({ currentTab, incrementTKN, incrementDXD }) => {
        if (currentTab === 0) {
            if (incrementTKN === 0) {
                return <Enable tokenType="TKN" />;
            } else if (incrementTKN === 1) {
                return (
                    <EnablePending
                        tokenType="TKN"
                        subtitleText="Sign Transaction..."
                    />
                );
            } else if (incrementTKN === 2) {
                return (
                    <EnablePending
                        tokenType="TKN"
                        subtitleText="Awaiting Confirmation..."
                    />
                );
            } else if (incrementTKN === 3) {
                return <EnableContinue tokenType="TKN" />;
            } else {
                return <BuyForm />;
            }
        } else {
            if (incrementDXD === 0) {
                return <Enable tokenType="DXD" />;
            } else if (incrementDXD === 1) {
                return (
                    <EnablePending
                        tokenType="DXD"
                        subtitleText="Sign Transaction..."
                    />
                );
            } else if (incrementDXD === 2) {
                return (
                    <EnablePending
                        tokenType="DXD"
                        subtitleText="Awaiting Confirmation..."
                    />
                );
            } else if (incrementDXD === 3) {
                return <EnableContinue tokenType="DXD" />;
            } else {
                return <SellForm />;
            }
        }
    };

    return (
        <BuySellWrapper>
            <TabWrapper>
                <TabButton currentTab={currentTab} tabType={0}>
                    Buy
                </TabButton>
                <TabButton currentTab={currentTab} tabType={1} left={true}>
                    Sell
                </TabButton>
            </TabWrapper>
            <ContentWrapper>
                <CryptoInfoWrapper>
                    <InfoRow>
                        <LogoAndText>
                            <ETHLogo src="ether.svg"></ETHLogo>
                            <LogoText>Ether</LogoText>
                        </LogoAndText>
                        <div>{ETHBalanceDisplay} ETH</div>
                    </InfoRow>
                    <InfoRow>
                        <LogoAndText>
                            <DXDLogo src="dxdao-circle.svg"></DXDLogo>
                            <LogoText>DXdao</LogoText>
                        </LogoAndText>
                        <div>{DXDBalanceDisplay} DXD</div>
                    </InfoRow>
                </CryptoInfoWrapper>
                <CurrentForm
                    currentTab={currentTab}
                    incrementTKN={incrementTKN}
                    incrementDXD={incrementDXD}
                />
            </ContentWrapper>
        </BuySellWrapper>
    );
});

export default BuySell;
