import React from 'react';
import { observer } from 'mobx-react';
import BuyInput from './BuyInput';
import BuySign from '../Buy/BuySign';
import BuyUnconfirmed from '../Buy/BuyUnconfirmed';
import BuyConfirmed from './BuyConfirmed';

const ContentStates = {
    BUY_FORM: 'sell_form',
    SIGN_TRANSACTION: 'signTransaction',
    UNCONFIRMED: 'unconfirmed',
    CONFIRMED: 'confirmed',
    APPROVED: 'approved',
    FAILED: 'failed'
};

const BuyForm = observer(() => {
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
            return <BuyInput/>;
        } else if (contentState === ContentStates.SIGN_TRANSACTION) {
            return <BuySign/>;
        } else if (contentState === ContentStates.UNCONFIRMED) {
            return <BuyUnconfirmed/>;
        } else if (contentState === ContentStates.CONFIRMED) {
            return <BuyConfirmed/>;
        } else if (contentState === ContentStates.FAILED) {
            return <BuyInput/>;
        }
    };
    return <Content contentCount={0} />;
});

export default BuyForm;
