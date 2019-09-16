import React from 'react'
import styled from 'styled-components'

const TradingHistoryWrapper = styled.div`
  width: 100%;
  background: white;
  padding-bottom: 15px;
  border: 2px solid var(--medium-gray);
  margin-top: 20px;
  border-radius: 4px;
`

const TradeHistoryTitle = styled.div`
  padding: 17px 15px;
  color: var(--dark-gray);
  border-bottom: 1px solid var(--light-gray);
  font-weight: 600; 
`

const TableHeadersWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  color: var(--medium-gray);
  padding: 15px 15px;
  font-size: 14px;
  font-weight: 600;
`

const TableHeader = styled.div`
`

const TableRow = styled.div`
  font-size: 14px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-bottom: 1px solid var(--light-gray);
  padding: 10px 15px;
  color: var(--dark-gray);
`

const TableCell = styled.div`
  font-weight: 500;
`

const TradingHistory = ({}) => {
  return (
    <TradingHistoryWrapper>
      <TradeHistoryTitle>Trade History</TradeHistoryTitle>
      <TableHeadersWrapper>
        <TableHeader>Type</TableHeader>
        <TableHeader>Price ETH</TableHeader>
        <TableHeader>Amount DXD</TableHeader>
        <TableHeader>Total ETH</TableHeader>
        <TableHeader>Status/Time</TableHeader>
      </TableHeadersWrapper>
      <TableRow>
        <TableCell className="blue-text">Buy</TableCell>
        <TableCell>154.202</TableCell>
        <TableCell>14.202</TableCell>
        <TableCell>14.202</TableCell>
        <TableCell className="turquois-text">03-11 17:53:42</TableCell>
      </TableRow>
      <TableRow>
        <TableCell className="red-text">Sell</TableCell>
        <TableCell>154.202</TableCell>
        <TableCell>14.202</TableCell>
        <TableCell>14.202</TableCell>
        <TableCell className="turquois-text">03-11 17:53:42</TableCell>
      </TableRow>
    </TradingHistoryWrapper>
  )
}

export default TradingHistory
