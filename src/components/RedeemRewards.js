import React from 'react';
import styled from 'styled-components';

const RedeemRewardsWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

const AvailableRewardsWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    padding: 40px 0px;
`;

const Title = styled.div`
    color: var(--dark-text-gray);
    font-size: 20px;
    height: 35px;
    line-height: 35px;
`;

const Balance = styled.div`
    width: 125px;
    height: 35px;
    line-height: 35px;
    text-align: center;
    text-transform: uppercase;
    color: var(--rewards-text-green);
    background: var(--rewards-background-green);
    border-radius: 6px;
`;

const DutchXRewardsWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 100px;
    background: white;
    padding: 0px 24px;
    border-radius: 4px;
`;

const LogoAndText = styled.div`
    display: flex;
    flex-direction: row;
`;

const LogoWrapper = styled.div`
    width: 52px;
    height: 52px;
    background: #0070d2;
    position: relative;
    border-radius: 26px;
`;

const Logo = styled.img`
    position: absolute;
    right: 0px;
    top: 0px;
`;

const LogoText = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-left: 24px;
`;

const LogoTextTop = styled.div`
    font-size: 16px;
    line-height: 22px;
    color: var(--dark-text-gray);
`;

const LogoTextBottom = styled.div`
    font-size: 15px;
    line-height: 22px;
    color: var(--light-text-gray);
`;

const RedeemButton = styled.div`
    height: 36px;
    line-height: 36px;
    font-size: 15px;
    color: var(--rewards-text-green);
    border: 1px solid var(--rewards-text-green);
    padding: 0px 14px;
    border-radius: 4px;
    text-transform: uppercase;
`;

const RedeemRewards = ({}) => {
    return (
        <RedeemRewardsWrapper>
            <AvailableRewardsWrapper>
                <Title>Available Rewards</Title>
                <Balance>+1.542 Eth</Balance>
            </AvailableRewardsWrapper>
            <DutchXRewardsWrapper>
                <LogoAndText>
                    <LogoWrapper>
                        <Logo></Logo>
                    </LogoWrapper>
                    <LogoText>
                        <LogoTextTop>DutchX Rewards</LogoTextTop>
                        <LogoTextBottom>
                            Redeem your share of profits.
                        </LogoTextBottom>
                    </LogoText>
                </LogoAndText>
                <RedeemButton>Redeem 1.542 Eth</RedeemButton>
            </DutchXRewardsWrapper>
        </RedeemRewardsWrapper>
    );
};

export default RedeemRewards;
