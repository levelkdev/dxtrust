     import React, { useState } from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import { useStores } from '../contexts/storesContext';

const TabWrapper = styled.div`
    display: flex;
    flex-direction: row;
`;

const ActiveTab = styled.div`
    color: var(--blue-text);
    width: 50%;
    text-align: center;
    border-left: ${(props) =>
        props.left ? '1px solid var(--medium-gray)' : 'none'};
    padding: 15px 0px;
    cursor: pointer;
`;

const InactiveTab = styled.div`
    color: var(--dark-text-gray);
    width: 50%;
    text-align: center;
    background-color: var(--light-gray);
    border-left: ${(props) =>
        props.left ? '1px solid var(--medium-gray)' : 'none'};
    border-bottom: 1px solid var(--medium-gray);
    border-radius: ${(props) => 
        props.left ? '0px 4px 0px 0px' : '4px 0px 0px 0px'};
    padding: 15px 0px;
    cursor: pointer;
`;

const BuySellTabs = observer(({currentTab, setCurrentTab}) => {
    const {
        root: { configStore, datStore },
    } = useStores();
	const sellText = datStore.isInitPhase(configStore.activeDatAddress) ? "Withdraw" : "Sell";

    const TabButton = ({ currentTab, tabType, left, children }) => {
        if (currentTab === tabType) {
            console.log(tabType);
            return (
                <ActiveTab
                    onClick={() => {
                        setCurrentTab(tabType);
                    }}
                    left={left}
                >
                    {children}
                </ActiveTab>
            );
        } else {
            return (
                <InactiveTab
                    onClick={() => {
                        setCurrentTab(tabType);
                    }}
                    left={left}
                >
                    {children}
                </InactiveTab>
            );
        }
    };

	return(
        <TabWrapper>
            <TabButton currentTab={currentTab} tabType={0}>
                Buy
            </TabButton>
            <TabButton currentTab={currentTab} tabType={1} left={true}>
                {sellText}
            </TabButton>
        </TabWrapper>
	);
});

export default BuySellTabs;