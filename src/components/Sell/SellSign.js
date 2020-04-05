import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import ActiveButton from '../common/ActiveButton';
import InactiveButton from '../common/InactiveButton';
import { useStores } from '../../contexts/storesContext';
import { collateralType } from '../../config.json';
import { formatBalance } from '../../utils/token';
import PendingCircle from '../common/PendingCircle';

const FormWrapper = styled.div`
    height: 200px;
    padding: 6px 0px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
`;

const InfoRow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    line-height: 24px;
    color: var(--dark-text-gray);
    margin-bottom: 12px;
`;

const FormInfoText = styled.div`
    color: var(--light-text-gray);
`;

const SignTransaction = styled.div`
    // font-family: SF Pro Text;
    font-size: 15px;
    line-height: 24px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    letter-spacing: 0.4px;
    color: var(--panel-pending);
    margin-top: 8px;
    margin-bottom: 23px;
`;


// class SellSign extends React.Component {
const SellSign = observer((props) => {
    const {
        root: { tradingStore },
    } = useStores();

    const price = tradingStore.formatSellPrice();
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
                <FormInfoText>Price</FormInfoText>
                <div>
                    {price} {collateralType}
                </div>
            </InfoRow>
            <InfoRow>
                <FormInfoText>Receive Amount</FormInfoText>
                <div>
                    {formatBalance(rewardForSell)} {collateralType}
                </div>
            </InfoRow>
            <InfoRow>
                <FormInfoText>Total cost</FormInfoText>
                <div>{sellAmount} DXD</div>
            </InfoRow>
            <SignTransaction>
                Sign Transaction...
                <PendingCircle />
            </SignTransaction>
            <Button active={false}>Sell DXD</Button>
        </FormWrapper>
    );
});

export default SellSign;
