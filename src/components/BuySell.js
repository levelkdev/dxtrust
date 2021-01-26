import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import BuyForm from './Buy/BuyForm';
import EnableForm from './Enable/EnableForm';
import SellForm from './Sell/SellForm';
import SellDisconnected from './Sell/SellDisconnected';
import { useStores } from '../contexts/storesContext';
import BalanceInfo from './BalanceInfo';
import BuySellTabs from './BuySellTabs';
import { TransactionState } from 'stores/TradingForm';

const BuySellWrapper = styled.div`
    display: flex;
    flex-direction: column;
    ${({ theme }) => theme.mediaWidth.upToMedium`
      width: calc(66%);
      margin: 0;
    `};
    width: calc(30%);
    background-color: white;
    border: 1px solid #EBE9F8;
    box-sizing: border-box;
    box-shadow: 0px 2px 10px rgba(14, 0, 135, 0.03), 0px 12px 32px rgba(14, 0, 135, 0.05);
    border-radius: 8px;
    justify-content: space-between;
    margin-left:10px;
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
    const incrementTKN = tradingStore.enableTKNState;
    const incrementDXD = tradingStore.enableDXDState;
    let isBuy = tradingStore.activeTab === 'buy';

    const CurrentForm = ({isBuy}) => {
        if (isBuy) {
                return <BuyForm />;
        } else {

            if (!account) {
                return <SellDisconnected />;
            } else if (tradingStore.enableDXDState !== TransactionState.APPROVED) {
                return <EnableForm />;
            } else {
                return <SellForm />;
            }
        }
    };

    return (
        <BuySellWrapper>
            <BuySellTabs isBuy={isBuy} />
            <ContentWrapper>
                <BalanceInfo />
                <CurrentForm
                    isBuy={isBuy}
                    incrementTKN={incrementTKN}
                    incrementDXD={incrementDXD}
                />
            </ContentWrapper>
        </BuySellWrapper>
    );
});

export default BuySell;
