import React from "react";
import { connect } from "react-redux";
import TradeHistory from "../components/TradeHistory";

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
)(TradeHistory);
