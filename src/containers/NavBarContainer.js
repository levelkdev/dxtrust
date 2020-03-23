import React from "react";
import { connect } from "react-redux";
import NavBar from "../components/NavBar";

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
)(NavBar);
