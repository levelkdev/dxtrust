import React from 'react';
import styled from 'styled-components';
import { useStores } from '../../contexts/storesContext';
import { observer } from 'mobx-react';
import { TXEvents } from 'types';
import { TransactionState } from 'stores/TradingForm';

const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

const CircleContainer = styled.div`
    height:168px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items:center;
`;

const CheckboxContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 48px;
    width: 100%;
    margin-bottom: 16px;
`;

const Info = styled.div`
    //font-family: SF Pro Text;
    font-size: 16px;
    line-height: 19px;
    letter-spacing: 0.4px;
    width:100%;
    color: var(--panel-text);
    display: flex;
    flex-direction: row;
    justify-content: center;
`;

const EnableButton = styled.div`
    background-color: #536dfe;
    border: 1px solid #304ffe;
    border-radius: 4px;
    color: white;
    text-align: center;
    height: 34px;
    line-height: 34px;
    text-transform: uppercase;
    cursor: pointer;
`;

const Enable = observer(({ tokenType }) => {
    const {
        root: { providerStore, configStore, tokenStore, tradingStore },
    } = useStores();

    const { account } = providerStore.getActiveWeb3React();
    const tokenAddress = configStore.getTokenAddress(tokenType);

    const hasMaxApproval = tokenStore.hasMaxApproval(
        tokenAddress,
        account,
        configStore.activeDatAddress
    );

    return (
        <ContentWrapper>
            <CircleContainer>
                <CheckboxContainer>
                    <img src="checkbox-circle.svg" />
                </CheckboxContainer>
                <Info>Enable {tokenType} for trading</Info>
            </CircleContainer>
            <EnableButton
                onClick={() => {
                    tradingStore.enableDXDState = TransactionState.SIGNING_TX;
                    tokenStore.approveMax(
                        providerStore.getActiveWeb3React(),
                        tokenAddress,
                        configStore.activeDatAddress
                    ).on(TXEvents.TX_HASH, (hash) => {
                        tradingStore.enableDXDState =
                            TransactionState.UNCONFIRMED;
                    })
                    .on(TXEvents.RECEIPT, (receipt) => {
                        tradingStore.enableDXDState =
                            TransactionState.CONFIRMED;
                    })
                    .on(TXEvents.TX_ERROR, (txerror) => {
                        tradingStore.enableDXDState = 
                            TransactionState.FAILED;
                    })
                    .on(TXEvents.INVARIANT, (error) => {
                        tradingStore.enableDXDState = 
                            TransactionState.FAILED;
                    });;
                }}
            >
                Enable {tokenType}
            </EnableButton>
        </ContentWrapper>
    );
});

export default Enable;
