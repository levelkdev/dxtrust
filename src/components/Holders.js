import React from 'react';

import { useStores } from '../contexts/storesContext';
import { observer } from 'mobx-react';

const Holders = observer(() => {
    const {
        root: { ethplorerStore },
    } = useStores();

    // tslint:disable-next-line:no-console
    console.debug('ethplorerStore.tokenInfo', ethplorerStore.tokenInfo);
    // tslint:disable-next-line:no-console
    console.debug('ethplorerStore.holders', ethplorerStore.holders);
    return (
        <>
            <span>
                total holders: {`${ethplorerStore.tokenInfo.holdersCount}`}
            </span>
        </>
    );
});

export default Holders;
