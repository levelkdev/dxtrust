import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import ActiveButton from '../common/ActiveButton';
import InactiveButton from '../common/InactiveButton';
import { useStores } from '../../contexts/storesContext';
import { formatBalance } from '../../utils/token';
import PendingCircle from '../common/PendingCircle';
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
    const {
        root: { tradingStore },
    } = useStores();

    const Button = ({ active, children, onClick }) => {
        if (active === true) {
            return (
                <ActiveButton onClick={onClick}>{children}</ActiveButton>
            );
        } else {
            return (
                <InactiveButton>{children}</InactiveButton>
            );
        }
    };

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
