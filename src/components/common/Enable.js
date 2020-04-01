import React from 'react';
import styled from 'styled-components';
import { useStores } from '../../contexts/storesContext';
import { observer } from 'mobx-react';

const ContentWrapper = styled.div`
    height: 200px;
    padding: 6px 0px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
`;

const CircleContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
`;

const CheckboxContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 48px;
    width: 48px;
    border-radius: 24px;
    border: 1px solid var(--panel-icon);
    margin-bottom: 16px;
`;

const Checkbox = styled.img`
    height: 13px;
    width: 18px;
`;

const Info = styled.div`
    //font-family: SF Pro Text;
    font-size: 16px;
    line-height: 19px;
    letter-spacing: 0.4px;
    color: var(--panel-text);
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-bottom: 40px;
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
        root: { providerStore, configStore, tokenStore },
    } = useStores();

    const tokenAddress = configStore.getTokenAddress(tokenType);

    return (
        <ContentWrapper>
            <CircleContainer>
                <CheckboxContainer>
                    <Checkbox src="checkbox.svg" />
                </CheckboxContainer>
            </CircleContainer>
            <Info>Enable {tokenType} for trading</Info>
            <EnableButton
                onClick={() => {
                    tokenStore.approveMax(
                        providerStore.getActiveWeb3React(),
                        tokenAddress,
                        configStore.activeDatAddress
                    );
                }}
            >
                Enable {tokenType}
            </EnableButton>
        </ContentWrapper>
    );
});

export default Enable;
