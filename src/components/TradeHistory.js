import React, { useState } from 'react'
import styled from 'styled-components'
import store from '../stores/Root'
import { observer, inject } from 'mobx-react'
import { collateralType } from '../config.json'

const TradingHistoryWrapper = styled.div`
  width: 100%;
  background: white;
  padding-bottom: 24px;
  border: 1px solid var(--medium-gray);
  margin-top: 20px;
  border-radius: 4px;
`

const TradeHistoryTitle = styled.div`
  padding: 17px 15px;
  color: var(--dark-text-gray);
  border-bottom: 1px solid var(--line-gray);
  font-weight: 600; 
`

const TableHeadersWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  color: var(--light-text-gray);
  padding: 15px 24px;
  font-size: 14px;
  font-weight: 600;
  text-align: right;
`

const TableHeader = styled.div`
  width: 20%;
`

const TableRow = styled.div`
  font-size: 15px;
  line-height: 18px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-bottom: 1px solid var(--line-gray);
  padding: 11px 24px 10px;
  color: var(--dark-text-gray);
  text-align: right;
`

const TableCell = styled.div`
  width: 20%;
  font-weight: 500;
  a {
    text-decoration: none;
    width: 100%;
  }
`

@observer
class TradingHistory extends React.Component {
  render() {
    const recentTrades = store.tradingStore.recentTrades
    return (
      <TradingHistoryWrapper>
        <TradeHistoryTitle>Trade History</TradeHistoryTitle>
        <TableHeadersWrapper>
          <TableHeader className="align-left">Type</TableHeader>
          <TableHeader>Price {collateralType}</TableHeader>
          <TableHeader>Amount DXD</TableHeader>
          <TableHeader>Total {collateralType}</TableHeader>
          <TableHeader className="align-right">Status/Time</TableHeader>
        </TableHeadersWrapper>
        {recentTrades.map(trade => (
          <TableRow>
            <TableCell className="blue-text" className="align-left">{trade.type}</TableCell>
            <TableCell>{trade.price}</TableCell>
            <TableCell>{trade.amount}</TableCell>
            <TableCell>{trade.totalPaid ? trade.totalPaid : trade.totalReceived}</TableCell>
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
    )
  }
}

export default TradingHistory
