import React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { collateralType } from '../config.json';
import { useStores } from '../contexts/storesContext';
import { EventType } from '../stores/datStore';
import { formatBalance, formatNormalizedBalance } from '../utils/token';

const TradingHistoryWrapper = styled.div`
    width: 100%;
    background: white;
    padding-bottom: 24px;
    border: 1px solid var(--medium-gray);
    margin-top: 24px;
    border-radius: 4px;
`;

const TradeHistoryTitle = styled.div`
    padding: 20px 24px;
    color: var(--dark-text-gray);
    border-bottom: 1px solid var(--line-gray);
    font-weight: 500;
    font-size: 18px;
    letter-spacing: 1px;
`;

const TableHeadersWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    color: var(--light-text-gray);
    padding: 20px 24px 8px;
    font-size: 14px;
    font-weight: 500;
    text-align: right;
`;

const TableHeader = styled.div`
    width: ${(props) => props.width || '23%'};
`;

const TableRow = styled.div`
    font-size: 16px;
    font-weight: 500;
    line-height: 18px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    border-bottom: 1px solid var(--line-gray);
    padding: 16px 24px;
    color: var(--dark-text-gray);
    text-align: right;
`;

const TableCell = styled.div`
    font-weight: 500;
    a {
        text-decoration: none;
        width: 100%;
    }
    color: ${(props) => props.color};
    width: ${(props) => props.width || '23%'};
`;

const TradingHistory = observer(() => {
    const {
        root: { tradingStore, providerStore },
    } = useStores();

    const recentTrades = tradingStore.recentTrades;
    return (
        <TradingHistoryWrapper>
            <TradeHistoryTitle>Trade History</TradeHistoryTitle>
            <TableHeadersWrapper>
                <TableHeader width="15.5%" className="align-left">
                    Type
                </TableHeader>
                <TableHeader width="15.5%">Price {collateralType}</TableHeader>
                <TableHeader>Amount DXD</TableHeader>
                <TableHeader>Total {collateralType}</TableHeader>
                <TableHeader className="align-right">Time</TableHeader>
            </TableHeadersWrapper>
            {recentTrades.map((trade) => (
                <TableRow>
                    <TableCell
                        width="15.5%"
                        color={
                            trade.type === EventType.Buy
                                ? 'var(--blue-text)'
                                : 'var(--red-text)'
                        }
                        className="blue-text align-left"
                    >
                        {trade.type}
                    </TableCell>
                    <TableCell width="15.5%">
                        {formatNormalizedBalance(trade.price)}
                    </TableCell>
                    <TableCell>{formatBalance(trade.amount)}</TableCell>
                    <TableCell>
                        {trade.totalPaid
                            ? formatBalance(trade.totalPaid)
                            : formatBalance(trade.totalReceived)}
                    </TableCell>
                    <TableCell>
                        <a
                            href={trade.hash}
                            target="#"
                            className="turquois-text"
                        >
                            {trade.blockTime}
                        </a>
                    </TableCell>
                </TableRow>
            ))}
        </TradingHistoryWrapper>
    );
});

export default TradingHistory;
