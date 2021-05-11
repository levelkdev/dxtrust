import React from 'react';
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
    background-color: #F1F3F5;
    border-radius: 6px;
    padding: 10px;
    margin-top: 10px;
`;

const InfoRow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-bottom: 12px;
    line-height: 24px;
    color: var(--dark-text-gray);
`;

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
            configStore.getTokenAddress(),
            account
        );
    }

    const ETHBalanceDisplay = ETHBalance ? formatBalance(ETHBalance) : '0.000';
    const DXDBalanceDisplay = DXDBalance ? formatBalance(DXDBalance) : '0.000';

	  return(
        <CryptoInfoWrapper>
            <span style={
              {fontFamily: "roboto", fontSize: "11px", color: "#9AA7CA", marginBottom: "10px"}
            }>YOUR HOLDINGS</span>
            <InfoRow>
                <LogoAndText>
                    <img src={require('assets/images/ether.svg')}></img>
                    <LogoText>Ether</LogoText>
                </LogoAndText>
                <div>{ETHBalanceDisplay} ETH</div>
            </InfoRow>
            <InfoRow>
                <LogoAndText>
                    <img src={require('assets/images/dxdao-circle.svg')}></img>
                    <LogoText>DXdao</LogoText>
                </LogoAndText>
                <div>{DXDBalanceDisplay} DXD</div>
            </InfoRow>
        </CryptoInfoWrapper>
	);
});

export default BalanceInfo;
