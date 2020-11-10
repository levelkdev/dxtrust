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

const BuyInput = observer((props) => {
    const {
        root: { datStore, tradingStore, configStore, providerStore, tokenStore },
    } = useStores();

    const [buyInputStatus, setBuyInputStatus] = useState("");

    const { account } = providerStore.getActiveWeb3React();
    const { infotext } = props;
    
    const price = (buyInputStatus === "") ? tradingStore.formatNumber(0) : tradingStore.formatBuyPrice();
    let disconnectedError = (tradingStore.buyAmount > 0) ? (account === null) ? true : false : false;
    let txFailedError = (tradingStore.buyingState === 5) && (buyInputStatus === "") ? true : false;
    const datState = datStore.getState();
    const requiredDataLoaded = datState !== undefined;

    if (buyInputStatus === "" && !tradingStore.payAmount.eq(0)) {
      tradingStore.setPayAmount(bnum(0));
    }

    const Button = ({ active, children, onClick }) => {
        if (active === true) {
            return <ActiveButton onClick={onClick}>{children}</ActiveButton>;
        } else {
            return (
                <InactiveButton>{children}</InactiveButton>
            );
        }
    };

    const checkActive = () => {
        return account && buyInputStatus === ValidationStatus.VALID && requiredDataLoaded;
    };

    const validateNumber = async (value) => {
        const ETHBalance = (account) ? tokenStore.getEtherBalance(account) : 0;
        value = value.replace(/^0+/, '');
        disconnectedError = (account === null) ? true : false;

        const buyInputStatusFetch = validateTokenValue(value, {
          minValue: normalizeBalance(
              datStore.getMinInvestment()
          ),
          maxBalance: (account) ? normalizeBalance(ETHBalance) : null,
        });
        setBuyInputStatus(buyInputStatusFetch);

        if (buyInputStatusFetch === ValidationStatus.VALID) {
            tradingStore.setBuyAmount(value);
            const buyReturn = await datStore.fetchBuyReturn(denormalizeBalance(value));
            tradingStore.handleBuyReturn(buyReturn);
        }   else {
            tradingStore.setPayAmount(bnum(0));
            tradingStore.setBuyPrice(bnum(0));
        }
    };
    return (
        <FormWrapper>
            <InfoRow>
                <FormInfoText>Price</FormInfoText>
                <div>
                    {price} {configStore.getDATinfo().collateralType}
                </div>
            </InfoRow>
            <InfoRow>
                <FormInfoText>{infotext}</FormInfoText>
                <div>{formatBalance(tradingStore.payAmount)} DXD</div>
            </InfoRow>
            <InputColumn>
                <FormContent>
                    <input
                        className="form-vivid-blue"
                        type="text"
                        placeholder="0"
                        onChange={(e) => validateNumber(e.target.value)}
                    />
                    <div>ETH</div>
                </FormContent>
                { txFailedError ? 
                    <MessageError> <p>Transaction failed</p> </MessageError>
                  :
                    <></>
                }
                {(disconnectedError || (buyInputStatus !== ValidationStatus.VALID)) ? (
                    <MessageError>
                        { 
                          (buyInputStatus !== ValidationStatus.VALID) ? <span>{buyInputStatus}</span> :
                          disconnectedError ? <p>Connect Wallet to proceed with order</p> : <></>
                        }
                    </MessageError>
                ) : (
                    <></>
                )}
            </InputColumn>
            <Button
                active={checkActive()}
                onClick={() => {
                    tradingStore.buyingState = TransactionState.SIGNING_TX;
                    datStore
                        .buy(
                            account,
                            denormalizeBalance(str(tradingStore.buyAmount)),
                            bnum(1)
                        )
                        .on(TXEvents.TX_HASH, (hash) => {
                            tradingStore.buyingState =
                                TransactionState.UNCONFIRMED;
                        })
                        .on(TXEvents.RECEIPT, (receipt) => {
                            tradingStore.setPreviousBuy({
                                buyAmount: denormalizeBalance(tradingStore.buyAmount),
                                payAmount: tradingStore.payAmount,
                                buyPrice: tradingStore.buyPrice
                            });
                            tradingStore.buyingState =
                                TransactionState.CONFIRMED;
                        })
                        .on(TXEvents.TX_ERROR, (txerror) => {
                            tradingStore.buyingState = 
                                TransactionState.FAILED;
                        })
                        .on(TXEvents.INVARIANT, (error) => {
                            tradingStore.buyingState = 
                                TransactionState.FAILED;
                        });
                }}
            >
                Buy DXD
            </Button>
        </FormWrapper>
    );
});

export default BuyInput;
