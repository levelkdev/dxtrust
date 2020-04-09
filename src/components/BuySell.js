import React, { useState } from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import BuyForm from './Buy/BuyForm';
import EnableContinue from './common/EnableContinue';
import Enable from './common/Enable';
import EnablePending from './common/EnablePending';
import SellForm from './Sell/SellForm';
import SellDisconnected from './Sell/SellDisconnected';
import { useStores } from '../contexts/storesContext';
import { DatState } from '../stores/datStore';
import BalanceInfo from './BalanceInfo';
import BuySellTabs from './BuySellTabs';

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

const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    padding: 24px;
`;

const BuySell = observer(() => {
    const {
        root: { tradingStore, providerStore },
    } = useStores();

    const { account } = providerStore.getActiveWeb3React();
    const [currentTab, setCurrentTab] = useState(0);
    const incrementTKN = tradingStore.enableTKNState;
    const incrementDXD = tradingStore.enableDXDState;

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
            if (!account) {
                return <SellDisconnected />;
            } else if (incrementDXD === 0) {
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
            <BuySellTabs currentTab={currentTab} setCurrentTab={setCurrentTab} />
            <ContentWrapper>
                <BalanceInfo />
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
