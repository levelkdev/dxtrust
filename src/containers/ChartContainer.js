import React from "react";
import { connect } from "react-redux";
// example:
// import { removeDataFeed, logDataFeedResult } from '../actions'
import BondingCurveChart from "../components/BondingCurveChart";

const mapStateToProps = (state) => ({
	// example:
	// dataFeeds: state.dataFeeds
});

const mapDispatchToProps = dispatch => ({
	// example:
	// handleRemove: ({ dataFeedAddress }) => {
	//   dispatch(removeDataFeed({ dataFeedAddress }))
	// },
	// handleUpdate: ({ dataFeedAddress }) => {
	//   dispatch(logDataFeedResult({ dataFeedAddress }))
	// }
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(BondingCurveChart);
