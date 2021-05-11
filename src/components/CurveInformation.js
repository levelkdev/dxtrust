import React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { useStores } from '../contexts/storesContext';
import {
    formatBalance,
} from '../utils/token';
import { bnum } from '../utils/helpers';

const CurveInformationWrapper = styled.div`
    width: 100%;
    background-color: white;
    border: 1px solid #EBE9F8;
    box-sizing: border-box;
    box-shadow: 0px 2px 10px rgba(14, 0, 135, 0.03), 0px 12px 32px rgba(14, 0, 135, 0.05);
    border-radius: 8px;
    padding: 23px, 35px, 23px, 35px;
    margin-top: 24px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    margin-right:10px;
    
    .loader {
      margin: 15px 0px;
      text-align: center;
      font-family: Roboto;
      font-style: normal;
      font-weight: 500;
      font-size: 15px;
      line-height: 18px;
      color: #BDBDBD;
      
      img {
        margin-bottom: 10px;
      }
    }
    
    ${({ theme }) => theme.mediaWidth.upToMedium`
      width: calc(30%);
    `};
`;

const CurveInformationHeaderWrapper = styled.div`
    display: flex;
    padding: 15px;
    flex-grow: 4;
    flex-wrap: wrap;
    justify-content: space-between;
    ${({ theme }) => theme.mediaWidth.upToMedium`
      flex-direction: column;
      border-bottom: none;
    `};
`;

const CurveInformationElement = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: calc((100% - 20) / 3);
    color: var(--dark-text-gray);
    padding: 10px 0px 10px 10px;
    ${({ theme }) => theme.mediaWidth.upToMedium`
      text-align: center;
      width: 100%;
      padding: 10px;
    `};
`;

const CurveInformationTopElement = styled.div`
    font-size: 13px;
    font-weight: 400;
    color: var(--light-text-gray);
`;

const CurveInformationBottomElement = styled.div`
    font-size: 16px;
    margin-top: 10px;
    font-weight: 500;
    color: 1px solid var(--line-gray);
`;

const CurveInformation = observer(() => {
    const {
        root: { tokenStore, configStore, datStore, providerStore },
    } = useStores();

    let preMintedTokens;
    let totalSupplyWithoutPremint;
    
    const buySlopeNum = datStore.getBuySlopeNum();
    const buySlopeDen = datStore.getBuySlopeDen();
    const daoFunds = datStore.getDaoFunds();
    const activeDATAddress = configStore.getTokenAddress();
    const staticParamsLoaded = datStore.areAllStaticParamsLoaded();
    const totalSupplyWithPremint = tokenStore.getTotalSupply(activeDATAddress);
    const burnedSupply = tokenStore.getBurnedSupply(activeDATAddress);
    const investmentReserveBasisPoints = datStore.getInvestmentReserveBasisPoints()

    const currrentDatState = datStore.getState();
    const reserveBalance = datStore.getReserveBalance();
    
    const { active: providerActive, library } = providerStore.getActiveWeb3React();

    const requiredDataLoaded =
        staticParamsLoaded &&
        !!totalSupplyWithPremint &&
        currrentDatState !== undefined &&
        !!reserveBalance;

    if (requiredDataLoaded) {
        preMintedTokens = datStore.getPreMintedTokens();
        totalSupplyWithoutPremint = totalSupplyWithPremint.minus(preMintedTokens).plus(burnedSupply);
    }

    const renderCurveInformation = () => {
      if (datStore.isRunPhase()) {
        return (
          <CurveInformationHeaderWrapper>
            <CurveInformationElement>
              <CurveInformationTopElement>Total Supply</CurveInformationTopElement>
              <CurveInformationBottomElement>
                {requiredDataLoaded ? `${formatBalance(totalSupplyWithPremint)} DXD` : '- DXD'}
              </CurveInformationBottomElement>
            </CurveInformationElement>
          
            <CurveInformationElement>
              <CurveInformationTopElement>
                Curve Issuance
              </CurveInformationTopElement>
              <CurveInformationBottomElement className="green-text">
                {requiredDataLoaded ? `${formatBalance( totalSupplyWithoutPremint )} DXD` : '- DXD'}
              </CurveInformationBottomElement>
            </CurveInformationElement>
              
            <CurveInformationElement>
              <CurveInformationTopElement>Reserve</CurveInformationTopElement>
              <CurveInformationBottomElement>
                {requiredDataLoaded ? `${formatBalance(reserveBalance)} ETH` : '- ETH'}
              </CurveInformationBottomElement>
            </CurveInformationElement>

            <CurveInformationElement>
              <CurveInformationTopElement>Curve Slope</CurveInformationTopElement>
              <CurveInformationBottomElement>
                {requiredDataLoaded ? `${buySlopeNum}/${library.utils.fromWei(buySlopeDen.toString())}` : '-'}
              </CurveInformationBottomElement>
            </CurveInformationElement>
            
            <CurveInformationElement>
              <CurveInformationTopElement>DXdao ETH Funds</CurveInformationTopElement>
              <CurveInformationBottomElement>
                {requiredDataLoaded ? `${formatBalance(daoFunds, 18, 0)} ETH` : '- ETH'}
              </CurveInformationBottomElement>
            </CurveInformationElement>
            
            <CurveInformationElement>
              <CurveInformationTopElement>Investment % Commitment</CurveInformationTopElement>
              <CurveInformationBottomElement>
                {requiredDataLoaded ? `${bnum(10000).div(investmentReserveBasisPoints).toString()} %` : '- %'}
              </CurveInformationBottomElement>
            </CurveInformationElement>
          </CurveInformationHeaderWrapper>
        );
      } else {
        return <React.Fragment />;
      }
    };

    if (requiredDataLoaded)
      return (
        <CurveInformationWrapper>
          {renderCurveInformation()}
        </CurveInformationWrapper>
      );
    else if (!providerActive) {
      return(
        <CurveInformationWrapper>
          <div className="loader">
          <img alt="bolt" src={require("assets/images/bolt.svg")} />
            <br/> Connect to view Curve Information
          </div>
        </CurveInformationWrapper>
      )
    } else return(
      <CurveInformationWrapper>
        <div className="loader">
        <img alt="bolt" src={require("assets/images/bolt.svg")} />
          <br/> Loading curve information..
        </div>
      </CurveInformationWrapper>
    )
});

export default CurveInformation;
