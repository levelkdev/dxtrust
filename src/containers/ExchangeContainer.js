import React from 'react'
import { connect } from 'react-redux'
// example:
// import { removeDataFeed, logDataFeedResult } from '../actions'
import ChartContainer from './ChartContainer'
import TradeHistoryContainer from './TradeHistoryContainer'
import BuySellContainer from './BuySellContainer'
import styled from 'styled-components'

const mapStateToProps = (state) => ({
  // example:
  // dataFeeds: state.dataFeeds
})

const mapDispatchToProps = dispatch => ({
  // example:
  // handleRemove: ({ dataFeedAddress }) => {
  //   dispatch(removeDataFeed({ dataFeedAddress }))
  // },
  // handleUpdate: ({ dataFeedAddress }) => {
  //   dispatch(logDataFeedResult({ dataFeedAddress }))
  // }
})

const ExchangeWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`

const Exchange = ({}) => {
  return (
    <ExchangeWrapper>  
      <ChartContainer />
      <BuySellContainer />
      <TradeHistoryContainer />
    </ExchangeWrapper>
  )  
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Exchange)
