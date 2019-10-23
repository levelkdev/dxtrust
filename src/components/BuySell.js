import React from 'react'
import styled from 'styled-components'

const BuySellWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 298px;
  margin-left: 24px;
  border: 1px solid var(--medium-gray);
  border-radius: 4px;
  background-color: white;
  justify-content: space-between;
`

const TabWrapper = styled.div`
  display: flex;
  flex-direction: row;
`

const ActiveTab = styled.div`
  color: blue;
  width: 50%;
  text-align: center;
  padding: 15px 0px;
`

const InactiveTab = styled.div`
  color: var(--dark-text-gray);
  width: 50%;
  text-align: center;
  background-color: var(--light-gray);
  border-left: 1px solid var(--medium-gray);
  border-bottom: 1px solid var(--medium-gray);
  border-radius: 0px 4px 0px 0px;
  padding: 15px 0px;
`

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 18px;
`

const CryptoInfoWrapper = styled.div`
  height: 100px;
  padding-bottom: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  border-bottom: 1px solid var(--line-gray);
`

const InfoRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  line-height: 24px;
  color: var(--dark-text-gray);
`

const LogoWrapper = styled.div`
  width: 24px;
  height: 24px;
  background: #667FE3;
  position: relative;
  border-radius: 12px;
`

const ETHLogo = styled.img`
  position: absolute;
  right: 7px;
  top: 4px;
`

const DXDLogo = styled.img`
  position: absolute;
  right: 1px;
  top: 1px;
`

const LogoAndText = styled.div`
  display: flex;
  flex-direction: row;
`

const LogoText = styled.div`
  margin-left: 10px;
  color: var(--light-text-gray);
`

const FormWrapper = styled.div`
  height: 200px;
  padding: 10px 0px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
`

const FormInfoText = styled.div`
  color: var(--light-text-gray);
`

const BuyForm = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  color: rgba(48, 79, 254, 0.2);
  border: 1px solid rgba(48, 79, 254, 0.2);
  border-radius: 4px;
  height: 34px;
  line-height: 34px;
`

const BuyDXDButton = styled.div`
  background-color: #536DFE;
  border: 1px solid #304FFE;
  border-radius: 4px;
  color: white;
  text-align: center;
  height: 34px;
  line-height: 34px;
  text-transform: uppercase;
`

const BuySell = ({}) => {
  return (
    <BuySellWrapper>
      <TabWrapper>
        <ActiveTab>Buy</ActiveTab>
        <InactiveTab>Sell</InactiveTab>
      </TabWrapper>
      <ContentWrapper>
        <CryptoInfoWrapper>
          <InfoRow>
            <LogoAndText>
              <LogoWrapper>
                <ETHLogo src="ETH-logo.svg"></ETHLogo>
              </LogoWrapper>
              <LogoText>Ether</LogoText>
            </LogoAndText>
            <div>1000.000 ETH</div>
          </InfoRow>
          <InfoRow>
            <LogoAndText>
              <LogoWrapper>
                <DXDLogo src="DXD-logo.svg"></DXDLogo>
              </LogoWrapper>
              <LogoText>Dxdao</LogoText>
            </LogoAndText>
            <div>100.000 DXD</div>
          </InfoRow>
        </CryptoInfoWrapper>
        <FormWrapper>
          <InfoRow>
            <FormInfoText>Price</FormInfoText>
            <div>1.502 DXD/ETH</div>
          </InfoRow>
          <InfoRow>
            <FormInfoText>Pay Amount</FormInfoText>
            <div>150.020 ETH</div>
          </InfoRow>
          <BuyForm>
            <div className="form-vivid-blue">100</div>
            <div>DXD</div>
          </BuyForm>
          <BuyDXDButton>Buy DXD</BuyDXDButton>
        </FormWrapper>
      </ContentWrapper>
    </BuySellWrapper>
  )
}

export default BuySell
