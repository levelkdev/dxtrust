import React, { useState } from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import { useStores } from '../contexts/storesContext';
import { formatBalance } from '../utils/token';

const CryptoInfoWrapper = styled.div`
    padding-bottom: 12px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    border-bottom: 1px solid var(--line-gray);
`;

const InfoRow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-bottom: 12px;
    line-height: 24px;
    color: var(--dark-text-gray);
`;

const DXDLogo = styled.img``;

const ETHLogo = styled.img``;

const LogoAndText = styled.div`
    display: flex;
    flex-direction: row;
`;

const LogoText = styled.div`
    margin-left: 12px;
    color: var(--light-text-gray);
`;

const BalanceInfo = observer(() => {
    const {
        root: { providerStore, tokenStore, configStore },
    } = useStores();

    const { account } = providerStore.getActiveWeb3React();

    let ETHBalance,
        DXDBalance = undefined;

    if (account) {
        ETHBalance = tokenStore.getEtherBalance(account);
        DXDBalance = tokenStore.getBalance(
            configStore.getDXDTokenAddress(),
            account
        );
    }

    const ETHBalanceDisplay = ETHBalance ? formatBalance(ETHBalance) : '0.000';
    const DXDBalanceDisplay = DXDBalance ? formatBalance(DXDBalance) : '0.000';

	  return(
        <CryptoInfoWrapper>
            <InfoRow>
                <LogoAndText>
                    <ETHLogo src="ether.svg"></ETHLogo>
                    <LogoText>Ether</LogoText>
                </LogoAndText>
                <div>{ETHBalanceDisplay} ETH</div>
            </InfoRow>
            <InfoRow>
                <LogoAndText>
                    <DXDLogo src="dxdao-circle.svg"></DXDLogo>
                    <LogoText>DXdao</LogoText>
                </LogoAndText>
                <div>{DXDBalanceDisplay} DXD</div>
            </InfoRow>
        </CryptoInfoWrapper>
	);
});

export default BalanceInfo;