import React, { useState } from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import ActiveButton from '../common/ActiveButton';
import InactiveButton from '../common/InactiveButton';
import { useStores } from '../../contexts/storesContext';
import {
    denormalizeBalance,
    formatBalance,
    normalizeBalance,
} from '../../utils/token';
import { bnum, str } from '../../utils/helpers';
import { TXEvents } from '../../types';
import { TransactionState } from '../../stores/TradingForm';
import { validateTokenValue, ValidationStatus } from '../../utils/validators';

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

const FormContent = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    color: rgba(48, 79, 254, 0.2);
    border: 1px solid rgba(48, 79, 254, 0.2);
    border-radius: 4px;
    height: 34px;
    line-height: 34px;
    margin-top: 12px;
    margin-bottom: 32px;
    font-weight: 600;
    font-size: 15px;
    input,
    input:focus {
        border: none;
        font-size: inherit;
        outline: none;
        ::placeholder {
            color: rgba(48, 79, 254, 0.4);
        }
    }
`;

const InputColumn = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const MessageError = styled.div`
    font-size: 12px;
    display: flex;
    flex-direction: row;
    position: absolute;
    padding-top: 40px;
    font-weight: 600;
    line-height: 14px;
    letter-spacing: 0.2px;
    align-self: flex-end;
    color: #E57373;
    white-space: nowrap;
`;

const SellInput = observer((props) => {
    const {
        root: { datStore, tradingStore, configStore, providerStore },
    } = useStores();

    const [hasError, setHasError] = useState(false);
    const [status, setStatus] = useState("");

    const { account } = providerStore.getActiveWeb3React();
    const price = tradingStore.formatSellPrice();
    const rewardForSell = tradingStore.rewardForSell;

    const checkActive = () => {
        if (tradingStore.sellAmount > 0) {
            return true;
        } else {
            return false;
        }
    }

    const validateNumber = async (value) => {
        value = value.replace(/^0+/, '');
        setHasError(!(value > 0));
        const statusFetch = validateTokenValue(value);
        setStatus(statusFetch);

        if (statusFetch === ValidationStatus.VALID) {
            tradingStore.setSellAmount(value);
            const weiValue = denormalizeBalance(value);

            const sellReturn = await datStore.fetchSellReturn(
              configStore.activeDatAddress,
              weiValue
            );

            tradingStore.handleSellReturn(sellReturn);
        }   else {
            tradingStore.setSellAmount(bnum(0));
            tradingStore.setSellPrice(bnum(0));
            tradingStore.setRewardForSell(bnum(0));
        }
    }


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
                    {price} {configStore.getCollateralType()}
                </div>
            </InfoRow>
            <InfoRow>
                <FormInfoText>Receive Amount</FormInfoText>
                <div>
                    {formatBalance(rewardForSell)} {configStore.getCollateralType()}
                </div>
            </InfoRow>
            <InputColumn>
                <FormContent>
                    <input
                        className="form-vivid-blue"
                        type="text"
                        placeholder="0"
                        onChange={(e) =>
                            validateNumber(e.target.value)
                        }
                    />
                    <div>DXD</div>
                </FormContent>
                {hasError ? (
                    <MessageError>
                      {status}
                    </MessageError>
                ) : (
                    <></>
                )}
            </InputColumn>
            <Button
                active={checkActive()}
                onClick={() => {
                    tradingStore.sellingState = TransactionState.SIGNING_TX;

                    // TODO What should last argument be set to?  (the minCurrencyReturned) 
                    datStore
                        .sell(
                            configStore.activeDatAddress,
                            account,
                            denormalizeBalance(str(tradingStore.sellAmount)),
                            bnum(1)
                        )
                        .on(TXEvents.TX_HASH, (hash) => {
                            tradingStore.sellingState =
                                TransactionState.UNCONFIRMED;
                        })
                        .on(TXEvents.RECEIPT, (receipt) => {
                            tradingStore.sellingState =
                                TransactionState.CONFIRMED;
                        })
                        .on(TXEvents.TX_ERROR, (error) => {
                            tradingStore.sellingState =
                                TransactionState.NONE;
                        })
                }}
            >
                Sell DXD
            </Button>
        </FormWrapper>
    );
});

export default SellInput;
