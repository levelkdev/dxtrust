import React from 'react';
import { observer } from 'mobx-react';
import SellInput from '../Sell/SellInput';
import SellSign from '../Sell/SellSign';
import SellUnconfirmed from '../Sell/SellUnconfirmed';
import SellConfirmed from '../Sell/SellConfirmed';
import { useStores } from '../../contexts/storesContext';

const ContentStates = {
    SELL_FORM: 'sell_form',
    SIGN_TRANSACTION: 'signTransaction',
    UNCONFIRMED: 'unconfirmed',
    CONFIRMED: 'confirmed',
    APPROVED: 'approved',
    FAILED: 'failed'
};

const SellForm = observer(() => {
    const {
        root: { tradingStore },
    } = useStores();

    const count = tradingStore.sellingState;


    const Content = ({ contentCount }) => {
        let contentState;
        if (contentCount === 0) {
            contentState = ContentStates.SELL_FORM;
        } else if (contentCount === 1) {
            contentState = ContentStates.SIGN_TRANSACTION;
        } else if (contentCount === 2) {
            contentState = ContentStates.UNCONFIRMED;
        } else if (contentCount === 3) {
            contentState = ContentStates.CONFIRMED;
        } else {
            contentState = ContentStates.FAILED;
        }

        if (contentState === ContentStates.SELL_FORM) {
            return <SellInput />;
        } else if (contentState === ContentStates.SIGN_TRANSACTION) {
            return <SellSign />;
        } else if (contentState === ContentStates.UNCONFIRMED) {
            return <SellUnconfirmed />;
        } else if (contentState === ContentStates.CONFIRMED) {
            return <SellConfirmed />;
        } else {
          return <SellInput />;
        }
    };

    return <Content contentCount={count} />;
});

export default SellForm;
