import React from 'react'
import { connect } from 'react-redux'
import Footer from '../components/Footer'

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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Footer)
