import React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { shortenAddress } from 'utils/address';
import WalletModal from 'components/WalletModal';
import { Spinner } from 'theme';
import Circle from 'assets/images/circle.svg';
import {
    injected,
    isChainIdSupported,
    web3ContextNames,
} from 'provider/connectors';
import Identicon from '../Identicon';
import { useStores } from '../../contexts/storesContext';
import Web3PillBox from '../Web3PillBox';


const WrongNetworkButton = styled.button`
    width: 142px;
    font-size: 0.9rem;
    justify-content: center;
    align-items: center;
    padding: 0.5rem;
    border: 1px solid var(--wrong-network-border);
    background-color: var(--wrong-network);
    color: var(--white);
    
    box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.15);
    font-size:0.9rem;
    font-weight:500;
    box-sizing: border-box;
    border-radius: 6px;
    user-select: none;
    &:hover {
        cursor: pointer;
        border: 1px solid var(--wrong-network-border-hover);
        background-color: var(--wrong-network-hover);
    }
    :focus {
        outline: none;
    }
`;

const SpinnerWrapper = styled(Spinner)`
    margin: 0 0.25rem 0 0.25rem;
`;

const Web3ConnectStatus = observer((props) => {

    const ConnectButton = styled.div`
        height: 38px;
        width: ${props.wide ? "unset" : "154px"}
        display: flex;
        justify-content: center;
        align-items: center;

        box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.15);
        font-size: 0.9rem;
        font-weight: 500;
        line-height: 18px;
        letter-spacing: 1px;

        cursor: pointer;
        user-select: none;
        
        padding: 0.5rem;
        border-image: initial;
        background: var(--blue-text);
        color: var(--white);
        border: 1px solid var(--active-button-border);
        box-sizing: border-box;
        border-radius: 6px;
        &:hover{
            cursor: pointer;
            background: var(--blue-onHover);
            border: 1px solid var(--blue-onHover-border);
        }

    `;
    
    const {
        root: { modalStore, transactionStore, providerStore },
    } = useStores();
    const {
        chainId,
        active,
        connector,
        error,
    } = providerStore.getActiveWeb3React();
    const { account, chainId: injectedChainId } = providerStore.getWeb3React(
        web3ContextNames.injected
    );

    const contextNetwork = providerStore.getWeb3React(web3ContextNames.backup);

    if (!chainId) {
        throw new Error('No chain ID specified');
    }

    let pending = undefined;
    let confirmed = undefined;
    let hasPendingTransactions = false;

    if (account && isChainIdSupported(injectedChainId)) {
        pending = transactionStore.getPendingTransactions(account);
        confirmed = transactionStore.getConfirmedTransactions(account);
        hasPendingTransactions = !!pending.length;
    }

    const toggleWalletModal = () => {
        modalStore.toggleWalletModal();
    };

    // handle the logo we want to show with the account
    function getStatusIcon() {
        if (connector === injected) {
            return <Identicon />;
        }
    }

    function getWeb3Status() {
        console.log('[GetWeb3Status]', {
            account,
            injectedChainId: injectedChainId,
            error,
        });
        // Wrong network
        if (account && !isChainIdSupported(injectedChainId)) {
            return (
                <WrongNetworkButton onClick={toggleWalletModal}>
                    Wrong Network
                </WrongNetworkButton>
            );
        } else if (account) {
            return (
                <Web3PillBox onClick={toggleWalletModal}>
                    {getStatusIcon()}
                    {shortenAddress(account)}
                </Web3PillBox>
            );
        } else if (error) {
            return (
                <WrongNetworkButton onClick={toggleWalletModal}>
                    Wrong Network
                </WrongNetworkButton>
            );
        } else {
            return (
                <ConnectButton
                    onClick={toggleWalletModal}
                    active={true}
                    >
                    {props.text}
                </ConnectButton>
                
            );
        }
    }

    if (!contextNetwork.active && !active) {
        return null;
    }

    return (
        <>
            {getWeb3Status()}
            <WalletModal
                pendingTransactions={pending}
                confirmedTransactions={confirmed}
            />
        </>
    );
});

export default Web3ConnectStatus;
