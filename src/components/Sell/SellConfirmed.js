import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import ActiveButton from '../common/ActiveButton';
import InactiveButton from '../common/InactiveButton';
import store from '../../stores/Root';
import { collateralType } from '../../config.json';

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

const Confirmed = styled.div`
    // font-family: SF Pro Text;
    font-size: 15px;
    line-height: 18px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    letter-spacing: 0.4px;
    color: var(--turquois-text);
    margin-top: 8px;
    margin-bottom: 23px;
`;

const CheckboxContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 18px;
    width: 18px;
    border-radius: 10px;
    border: 1px solid var(--panel-icon-2);
`;

const Checkbox = styled.img`
    height: 6px;
    width: 8px;
`;

@observer
class SellConfirmed extends React.Component {
    render() {
        const price = store.tradingStore.formatPrice();
        const rewardForSell = store.tradingStore.formatRewardForSell();
        const sellAmount = store.tradingStore.formatSellAmount();

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
                    <FormInfoText>Receive</FormInfoText>
                    <div>
                        {rewardForSell} {collateralType}
                    </div>
                </InfoRow>
                <InfoRow>
                    <FormInfoText>Sell Amount</FormInfoText>
                    <div>{sellAmount} DXD</div>
                </InfoRow>
                <Confirmed>
                    Confirmed
                    <CheckboxContainer>
                        <Checkbox src="checkbox_758AFE.svg" />
                    </CheckboxContainer>
                </Confirmed>
                <Button
                    active={true}
                    onClick={() => {
                        store.tradingStore.sellingState = 0;
                        store.tradingStore.sellAmount = 0;
                    }}
                >
                    Sell Again
                </Button>
            </FormWrapper>
        );
    }
}

export default SellConfirmed;
