import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import Web3ConnectStatus from '../Web3ConnectStatus';

const FormWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

const InfoRow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 166px;

`;

const DisconnectedMessage = styled.div`
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    align-items: center;
    text-align: center;
    letter-spacing: 0.4px;
    color: #758AFE;
`;

const SellDisconnected = observer((props) => {

    return (
        <FormWrapper>
            <InfoRow>
                <DisconnectedMessage>Connect an Ethereum Wallet to get started</DisconnectedMessage>
            </InfoRow>
            <Web3ConnectStatus wide text="CONNECT WALLET"/>
        </FormWrapper>
    );
});

export default SellDisconnected;
