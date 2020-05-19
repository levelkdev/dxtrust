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

const AlertWrapper = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: start;
    width: 100%;
    background: white;
    border: 1px solid var(--medium-gray);
    padding: 0px 24px;
    margin-bottom: 24px;
    border-radius: 4px;
`;

const AlertText = styled.div`
    color: var(--dark-text-gray);
    font-weight: 500;
    padding: 20px 0px 20px 16px;
`;

const Exchange = ({}) => {
    return (
            <ExchangeWrapper>
            <AlertWrapper>
            <img src="dangerous.svg"/>
                    <AlertText>Secondary Markets may have better offers!</AlertText>
            </AlertWrapper>
                <ChartContainer />
                <BuySellContainer />
                <TradeHistoryContainer />
            </ExchangeWrapper>
    );
};

export default Exchange;
