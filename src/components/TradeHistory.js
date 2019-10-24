import React from 'react'
import styled from 'styled-components'

const TradingHistoryWrapper = styled.div`
  width: 100%;
  background: white;
  padding-bottom: 15px;
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
  color: var(--medium-gray);
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

const TradingHistory = ({}) => {
  return (
    <TradingHistoryWrapper>
      <TradeHistoryTitle>Trade History</TradeHistoryTitle>
      <TableHeadersWrapper>
        <TableHeader className="align-left"><TableCellContent>Type</TableCellContent></TableHeader>
        <TableHeader><TableCellContent>Price ETH</TableCellContent></TableHeader>
        <TableHeader><TableCellContent>Amount DXD</TableCellContent></TableHeader>
        <TableHeader><TableCellContent>Total ETH</TableCellContent></TableHeader>
        <TableHeader><TableCellContent className="align-right">Status/Time</TableCellContent></TableHeader>
      </TableHeadersWrapper>
      <TableRow>
        <TableCell className="blue-text" className="align-left">Buy</TableCell>
        <TableCell>154.202</TableCell>
        <TableCell>14.202</TableCell>
        <TableCell>14.202</TableCell>
        <TableCell>
          <a
            href="https://etherscan.io/tx/0x0a6508498110d277668c2775f2eae27595a87c6b9f6a6bcd817d63f3c0ce4e8a"
            target="#"
            className="turquois-text"
          >
            03-11 17:53:42
          </a>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell className="red-text" className="align-left">Sell</TableCell>
        <TableCell>154.202</TableCell>
        <TableCell>14.202</TableCell>
        <TableCell>14.202</TableCell>
        <TableCell>
          <a
            href="https://etherscan.io/tx/0x0a6508498110d277668c2775f2eae27595a87c6b9f6a6bcd817d63f3c0ce4e8a"
            target="#"
            className="turquois-text"
          >
            03-11 17:53:42
          </a>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell className="red-text" className="align-left">Sell</TableCell>
        <TableCell>154.202</TableCell>
        <TableCell>14.202</TableCell>
        <TableCell>14.202</TableCell>
        <TableCell>
          <a
            href="https://etherscan.io/tx/0x0a6508498110d277668c2775f2eae27595a87c6b9f6a6bcd817d63f3c0ce4e8a"
            target="#"
            className="turquois-text"
          >
            03-11 17:53:42
          </a>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell className="red-text" className="align-left">Sell</TableCell>
        <TableCell>154.202</TableCell>
        <TableCell>14.202</TableCell>
        <TableCell>14.202</TableCell>
        <TableCell>
          <a
            href="https://etherscan.io/tx/0x0a6508498110d277668c2775f2eae27595a87c6b9f6a6bcd817d63f3c0ce4e8a"
            target="#"
            className="turquois-text"
          >
            03-11 17:53:42
          </a>
        </TableCell>
      </TableRow>
    </TradingHistoryWrapper>
  )
}

export default TradingHistory
