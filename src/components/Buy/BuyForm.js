import React from 'react';
import { observer } from 'mobx-react';
import ActiveButton from '../common/ActiveButton';
import InactiveButton from '../common/InactiveButton';
import BuyInput from './BuyInput';
import BuySign from '../Buy/BuySign';
import BuyUnconfirmed from '../Buy/BuyUnconfirmed';
import BuyConfirmed from './BuyConfirmed';
import { useStores } from '../../contexts/storesContext';

const ContentStates = {
    SELL_FORM: 'sell_form',
    SIGN_TRANSACTION: 'signTransaction',
    UNCONFIRMED: 'unconfirmed',
    CONFIRMED: 'confirmed',
};

const BuyForm = observer((props) => {
    const {
        root: { tradingStore },
    } = useStores();

    const infotext = 'Tokens Issued';
    const count = tradingStore.buyingState;

    const Button = ({ active, children, onClick }) => {
        if (active === true) {
            return <ActiveButton onClick={onClick}>{children}</ActiveButton>;
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
            return <BuyInput infotext={infotext} />;
        } else if (contentState === ContentStates.SIGN_TRANSACTION) {
            return <BuySign infotext={infotext} />;
        } else if (contentState === ContentStates.UNCONFIRMED) {
            return <BuyUnconfirmed infotext={infotext} />;
        } else if (contentState === ContentStates.CONFIRMED) {
            return <BuyConfirmed infotext={infotext} />;
        }
    };
    return <Content contentCount={count} />;
});

export default BuyForm;
