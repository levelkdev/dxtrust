import React from 'react';
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

const BuySellTabs = observer(() => {
    const {
        root: { configStore, datStore, tradingStore },
    } = useStores();

    const activeTab = tradingStore.activeTab;
    const TabButton = ({tabType, children }) => {
        if (activeTab === tabType) {
            return (
                <ActiveTab left={activeTab === 'sell'} >
                    {children}
                </ActiveTab>
            );
        } else {
            return (
                <InactiveTab
                  left={activeTab === 'buy'}
                  onClick={() => { tradingStore.setActiveTab(tabType); }}
                >
                    {children}
                </InactiveTab>
            );
        }
    };

	return(
        <TabWrapper>
            <TabButton tabType={'buy'}>
                Buy
            </TabButton>
            <TabButton tabType={'sell'}>
                {datStore.isInitPhase(configStore.getTokenAddress()) ? "Withdraw" : "Sell"}
            </TabButton>
        </TabWrapper>
	);
});

export default BuySellTabs;
