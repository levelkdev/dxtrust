import React from "react";
import styled from "styled-components";
import store from "../../stores/Root";

const ContentWrapper = styled.div`
  height: 200px;
  padding: 6px 0px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
const InfoWrapper = styled.div`
  height: 200px;
  padding: 6px 0px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Info = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  display: flex;
  align-items: center;
  text-align: center;
  letter-spacing: 0.4px;
  color: rgba(83, 109, 254, 0.8);
  margin
`;

const EnableButton = styled.div`
  background-color: #536DFE;
  border: 1px solid #304FFE;
  border-radius: 4px;
  color: white;
  text-align: center;
  height: 34px;
  line-height: 34px;
  text-transform: uppercase;
  cursor: pointer;
`;

const ConnectionPending = ({tokenType}) => {
	return (
		<ContentWrapper>
      <InfoWrapper>
        <Info>
          Connet to Ethereum Wallet to start trading
        </Info>
      </InfoWrapper>
			<EnableButton onClick={() => {store.tradingStore.enableToken(tokenType);}}>Connnect Wallet</EnableButton>
		</ContentWrapper>
	);
};

export default ConnectionPending;
