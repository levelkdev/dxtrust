import React from 'react';
import { observer } from 'mobx-react';
import ActiveButton from '../common/ActiveButton';
import InactiveButton from '../common/InactiveButton';
import { useStores } from '../../contexts/storesContext';
import Enable from './Enable';
import EnablePending from './EnablePending';
import { TransactionState } from 'stores/TradingForm';
import EnableContinue from './EnableContinue';

const EnableForm = observer(() => {
    const {
        root: { tradingStore },
    } = useStores();

    const Button = ({ active, children, onClick }) => {
        if (active === true) {
            return <ActiveButton onClick={onClick}>{children}</ActiveButton>;
        } else {
            return <InactiveButton>{children}</InactiveButton>;
        }
    };

    if (tradingStore.enableDXDState === TransactionState.NONE) {
        return <Enable tokenType="DXD" />;
    } else if (tradingStore.enableDXDState === TransactionState.SIGNING_TX) {
        return <EnablePending
        tokenType="DXD"
        subtitleText="Sign Transaction..."
    />;
    } else if (tradingStore.enableDXDState === TransactionState.UNCONFIRMED) {
        return <EnablePending
                tokenType="DXD"
                subtitleText="Awaiting Confirmation..."
            />
        ;
    } else if (tradingStore.enableDXDState === TransactionState.CONFIRMED) {
        return <EnableContinue />;
    } else if (tradingStore.enableDXDState === TransactionState.FAILED) {
        return <Enable tokenType="DXD" />;
    } 
});

export default EnableForm;
