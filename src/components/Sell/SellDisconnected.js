import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import ActiveButton from '../common/ActiveButton';
import InactiveButton from '../common/InactiveButton';
import { DATinfo } from '../../blockchainInfo.json';
import { useStores } from '../../contexts/storesContext';
import { formatBalance } from '../../utils/token';
import PendingCircle from '../common/PendingCircle';
import Web3ConnectStatus from '../Web3ConnectStatus';


const FormWrapper = styled.div`
    padding-top: 24px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 180px;
`;

const InfoRow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    line-height: 20px;
    color: var(--dark-text-gray);
    margin-bottom: 12px;
    padding-top: 20px;
`;

const DisconnectedMessage = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 19px;
    align-items: center;
    text-align: center;
    letter-spacing: 0.4px;
    color: rgba(83, 109, 254, 0.8);
`;

const SellDisconnected = observer((props) => {
    const {
        root: { tradingStore },
    } = useStores();

    const price = tradingStore.formatPrice();
    const rewardForSell = tradingStore.rewardForSell;
    const sellAmount = tradingStore.formatSellAmount();

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
                <DisconnectedMessage>Connect an Etehreum Wallet to get started</DisconnectedMessage>
            </InfoRow>
            <Web3ConnectStatus wide text="CONNECT WALLET"/>
        </FormWrapper>
    );
});

export default SellDisconnected;
