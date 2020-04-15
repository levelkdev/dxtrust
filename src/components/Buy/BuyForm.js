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
    BUY_FORM: 'sell_form',
    SIGN_TRANSACTION: 'signTransaction',
    UNCONFIRMED: 'unconfirmed',
    CONFIRMED: 'confirmed',
    APPROVED: 'approved',
    FAILED: 'failed'
};

const BuyForm = observer((props) => {
    const {
        root: { tradingStore },
    } = useStores();

    const infotext = 'Buy Amount';
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
            contentState = ContentStates.BUY_FORM;
        } else if (contentCount === 1) {
            contentState = ContentStates.SIGN_TRANSACTION;
        } else if (contentCount === 2) {
            contentState = ContentStates.UNCONFIRMED;
        } else if (contentCount === 3) {
            contentState = ContentStates.CONFIRMED;
        } else {
            contentState = ContentStates.FAILED;
        }

        if (contentState === ContentStates.BUY_FORM) {
            return <BuyInput infotext={infotext} />;
        } else if (contentState === ContentStates.SIGN_TRANSACTION) {
            return <BuySign infotext={infotext} />;
        } else if (contentState === ContentStates.UNCONFIRMED) {
            return <BuyUnconfirmed infotext={infotext} />;
        } else if (contentState === ContentStates.CONFIRMED) {
            return <BuyConfirmed infotext={infotext} />;
        } else if (contentState === ContentStates.FAILED) {
            return <BuyInput infotext={infotext} />;
        }
    };
    return <Content contentCount={count} />;
});

export default BuyForm;
