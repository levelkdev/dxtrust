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
        root: { datStore, tradingStore, configStore, providerStore, tokenStore },
    } = useStores();

    const [sellInputStatus, setSellInputStatus] = useState("");

    const { account } = providerStore.getActiveWeb3React();
    const price = (sellInputStatus === "") ? tradingStore.formatNumber(0) : tradingStore.formatSellPrice();
    const rewardForSell = (sellInputStatus === "") ? bnum(0) : tradingStore.rewardForSell;
    let txFailedError = (tradingStore.sellingState === 5) && (sellInputStatus === "") ? true : false;
    const sellText = datStore.isInitPhase() ? "Withdraw" : "Sell";

    const checkActive = () => {
        return sellInputStatus === ValidationStatus.VALID;
    }
    
    if (sellInputStatus === "" && tradingStore.sellAmount !== 0) {
      tradingStore.setSellAmount(bnum(0));
    }

    const validateNumber = async (value) => {
        value = value.replace(/^0+/, '');
        const DXDBalance =  (account) ? tokenStore.getBalance(configStore.getTokenAddress(), account) : 0;
        const sellInputStatusFetch = validateTokenValue(value, {
          maxBalance: (account) ? normalizeBalance(DXDBalance) : null,
        });
        setSellInputStatus(sellInputStatusFetch);

        if (sellInputStatusFetch === ValidationStatus.VALID) {
            tradingStore.setSellAmount(value);
            const sellReturn = datStore.fetchSellReturn(denormalizeBalance(value));
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
                    {price} {configStore.getDATinfo().collateralType}
                </div>
            </InfoRow>
            <InfoRow>
                <FormInfoText>Receive Amount</FormInfoText>
                <div>
                    {formatBalance(rewardForSell)} {configStore.getDATinfo().collateralType}
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
                { txFailedError ? 
                    <MessageError> <p>Transaction failed</p> </MessageError>
                  :
                    <></>
                }
                {sellInputStatus !== ValidationStatus.VALID ? (
                    <MessageError>
                      {sellInputStatus}
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
                            account,
                            denormalizeBalance(str(tradingStore.sellAmount)),
                            bnum(1)
                        )
                        .on(TXEvents.TX_HASH, (hash) => {
                            tradingStore.sellingState =
                                TransactionState.UNCONFIRMED;
                        })
                        .on(TXEvents.RECEIPT, (receipt) => {
                            tradingStore.setPreviousSell({
                                sellPrice: bnum(price),
                                sellAmount: denormalizeBalance(tradingStore.sellAmount),
                                rewardForSell: tradingStore.rewardForSell
                            })
                            tradingStore.sellingState =
                                TransactionState.CONFIRMED;
                        })
                        .on(TXEvents.TX_ERROR, (error) => {
                            tradingStore.sellingState =
                                TransactionState.FAILED;
                        })
                        .on(TXEvents.INVARIANT, (error) => {
                            tradingStore.sellingState = 
                                TransactionState.FAILED;
                        });
                }}
            >
                {sellText} {sellText  === "Withdraw" ? 'ETH' : 'DXD'}
            </Button>
        </FormWrapper>
    );
});

export default SellInput;
