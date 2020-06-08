import React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { useStores } from '../contexts/storesContext';
import { EventType } from '../stores/datStore';
import { formatBalance, formatNumberValue } from '../utils/token';

const TradingHistoryWrapper = styled.div`
    width: 100%;
    background: white;
    padding: 20px 0px;
    border: 1px solid var(--medium-gray);
    margin-top: 24px;
    font-weight: 400;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    
    .loader {
      text-align: center;
      font-family: Roboto;
      font-style: normal;
      font-weight: 500;
      font-size: 15px;
      line-height: 18px;
      color: #BDBDBD;
      
      img {
        margin-bottom: 10px;
      }
    }
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
    text-align: right;
`;

const TableHeader = styled.div`
    width: ${(props) => props.width || '23%'};
`;

const TableRowsWrapper = styled.div`
    overflow-y: scroll;
    height: 260px;
`;

const TableRow = styled.div`
    font-size: 16px;
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
    a {
        text-decoration: none;
        width: 100%;

        &:hover{
            color: var(--turquois-text-onHover);
        }
    }
    color: ${(props) => props.color};
    width: ${(props) => props.width || '23%'}
    text-align: ${(props) => props.align};
    font-weight: ${(props) => props.weight};
`;

const TableCellType = styled(TableCell)`
    text-align: left;
`;

const TradingHistory = observer(() => {
    const {
        root: { tradingStore, configStore },
    } = useStores();

    let recentTrades = [];
    if (tradingStore.recentTradesSet) {
        recentTrades = tradingStore.recentTrades;
    }

    if (recentTrades.length == 0) {
      return (
          <TradingHistoryWrapper>
            <div className="loader">
            <img src={require("../assets/images/bolt.svg")} />
                <br/>
                Connect to view Trade History
            </div>
          </TradingHistoryWrapper>
      )
    } else {
      return (
          <TradingHistoryWrapper>
              <TradeHistoryTitle>Trade History</TradeHistoryTitle>
              <TableHeadersWrapper>
                  <TableHeader width="15.5%" className="align-left">
                      Type
                  </TableHeader>
                  <TableHeader width="15.5%">
                      Price {configStore.getCollateralType()}
                  </TableHeader>
                  <TableHeader>Amount DXD</TableHeader>
                  <TableHeader>
                      Total {configStore.getCollateralType()}
                  </TableHeader>
                  <TableHeader className="align-right">Time</TableHeader>
              </TableHeadersWrapper>
              <TableRowsWrapper>
              {recentTrades.map((trade, i) =>
                (trade && trade.type) ? (
                  <TableRow key={"tradeRow"+i}>
                      <TableCell
                          width="15.5%"
                          color={
                              trade.type === EventType.Buy
                                  ? 'var(--blue-text)'
                                  : 'var(--red-text)'
                          }
                          align="left"
                          weight='500'
                      >
                          {trade.type}
                      </TableCell>
                      <TableCell width="15.5%">
                          {formatNumberValue(trade.price)}
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
                  </TableRow>)
                : (<div/>)
              )}
              </TableRowsWrapper>
          </TradingHistoryWrapper>
      );
    }
});

export default TradingHistory;
