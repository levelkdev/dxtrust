import React, { useState } from 'react'
import styled from 'styled-components'
import store from '../stores/Root'
import { observer, inject } from 'mobx-react'

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

const TableCellContent = styled.div`
`

@observer
class TradingHistory extends React.Component {


  render() {


    let recentTrades = store.tradingStore.recentTrades
    if(store.providerStore.web3 && !store.tradingStore.recentTradesSet) {
      store.tradingStore.setRecentTrades()
      console.log("getting recent trades" + recentTrades.length)
    }

    return (
      <TradingHistoryWrapper>
        <TradeHistoryTitle>Trade History</TradeHistoryTitle>
        <TableHeadersWrapper>
          <TableHeader className="align-left"><TableCellContent>Type</TableCellContent></TableHeader>
          <TableHeader><TableCellContent>Price TKN</TableCellContent></TableHeader>
          <TableHeader><TableCellContent>Amount DXD</TableCellContent></TableHeader>
          <TableHeader><TableCellContent>Total TKN</TableCellContent></TableHeader>
          <TableHeader><TableCellContent className="align-right">Status/Time</TableCellContent></TableHeader>
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
