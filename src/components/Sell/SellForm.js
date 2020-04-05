import React from 'react';
import { observer } from 'mobx-react';
import ActiveButton from '../common/ActiveButton';
import InactiveButton from '../common/InactiveButton';
import SellInput from '../Sell/SellInput';
import SellSign from '../Sell/SellSign';
import SellUnconfirmed from '../Sell/SellUnconfirmed';
import SellConfirmed from '../Sell/SellConfirmed';
import { useStores } from '../../contexts/storesContext';

const ContentStates = {
    SELL_FORM: 'sell_form',
    SIGN_TRANSACTION: 'signTransaction',
    UNCOMFIRMED: 'unconfirmed',
    CONFIRMED: 'confirmed',
};

const SellForm = observer((props) => {
    const {
        root: { tradingStore },
    } = useStores();

    const infotext = 'Receive Amount';
    const count = tradingStore.sellingState;

    const Button = ({ active, children, onClick }) => {
        if (active === true) {
            return (
                <ActiveButton onClick={onClick}>{children}</ActiveButton>
            );
        } else {
            return <InactiveButton>{children}</InactiveButton>;
        }
    };

    const Content = ({ contentCount }) => {
        let contentState;
        if (contentCount === 0) {
            contentState = ContentStates.SELL_FORM;
        } else if (contentCount === 1) {
            contentState = ContentStates.SIGN_TRANSACTION;
        } else if (contentCount === 2) {
            contentState = ContentStates.UNCONFIRMED;
        } else {
            contentState = ContentStates.CONFIRMED;
        }

        if (contentState === ContentStates.SELL_FORM) {
            return <SellInput />;
        } else if (contentState === ContentStates.SIGN_TRANSACTION) {
            return <SellSign />;
        } else if (contentState === ContentStates.UNCONFIRMED) {
            return <SellUnconfirmed />;
        } else if (contentState === ContentStates.CONFIRMED) {
            return <SellConfirmed />;
        }
    };

    return <Content contentCount={count} />;
});

export default SellForm;
