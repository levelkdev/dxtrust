import React from 'react';
import ChartContainer from './ChartContainer';
import TradeHistoryContainer from './TradeHistoryContainer';
import BuySellContainer from './BuySellContainer';
import styled from 'styled-components';

const ExchangeWrapper = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
`;

const Exchange = ({}) => {
    return (
        <ExchangeWrapper>
            <ChartContainer />
            <BuySellContainer />
            <TradeHistoryContainer />
        </ExchangeWrapper>
    );
};

export default Exchange;
