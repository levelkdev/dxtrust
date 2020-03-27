import React from "react";
import styled from "styled-components";
import store from "../../stores/Root";

const ConnectionPending = ({tokenType}) => {
	return (
		<div className="connectionPendingWrapper">
        <div className="connectText">
          Connect to Ethereum Wallet to start trading
        </div>
      <button className="connectButton">Connect Wallet</button>
		</div>
	);
};

export default ConnectionPending;
