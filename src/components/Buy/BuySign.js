import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import ActiveButton from '../common/ActiveButton';
import InactiveButton from '../common/InactiveButton';
import { DATinfo } from '../../blockchainInfo.json';
import { useStores } from '../../contexts/storesContext';
import { formatBalance } from '../../utils/token';
import PendingCircle from '../common/PendingCircle';

const FormWrapper = styled.div`
    padding-top: 24px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
`;

const InfoRow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    line-height: 20px;
    color: var(--dark-text-gray);
    margin-bottom: 12px;
`;

const FormInfoText = styled.div`
    color: var(--light-text-gray);
`;

const SignTransaction = styled.div`
    font-size: 15px;
    line-height: 20px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    letter-spacing: 0.4px;
    color: var(--panel-pending);
    margin-bottom: 28px;
`;

const BuySign = observer((props) => {
    const {
        root: { tradingStore },
    } = useStores();

    const { infotext } = props;
    const price = tradingStore.formatPrice();
    const priceToBuy = tradingStore.formatPriceToBuy();
    const buyAmount = tradingStore.formatBuyAmount();

    const Button = ({ active, children, onClick }) => {
        if (active === true) {
            return <ActiveButton onClick={onClick}>{children}</ActiveButton>;
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
                    {price} {DATinfo.collateralType}
                </div>
            </InfoRow>
            <InfoRow>
                <FormInfoText>{infotext}</FormInfoText>
                <div>
                    {formatBalance(tradingStore.payAmount)} {DATinfo.collateralType}
                </div>
            </InfoRow>
            <InfoRow>
                <FormInfoText>Total cost</FormInfoText>
                <div>{tradingStore.buyAmount} {collateralType}</div>
            </InfoRow>
            <SignTransaction>
                Sign Transaction...
                <PendingCircle />
            </SignTransaction>
            <Button active={false}>Buy DXD</Button>
        </FormWrapper>
    );
});

export default BuySign;
