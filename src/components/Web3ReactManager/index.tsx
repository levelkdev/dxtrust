import React, { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import styled from 'styled-components';
import { injected, web3ContextNames } from 'provider/connectors';
import { useEagerConnect, useInactiveListener } from 'provider/providerHooks';
import { useStores } from 'contexts/storesContext';
import { useInterval } from 'utils/helperHooks';

const MessageWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 20rem;
`;

const Message = styled.h2`
    color: ${({ theme }) => theme.bodyText};
`;

const Web3ReactManager = ({ children }) => {
    const {
        root: { modalStore, providerStore, blockchainFetchStore },
    } = useStores();

    const web3ContextInjected = useWeb3React(web3ContextNames.injected);
    const {
        active: networkActive,
        error: networkError,
        activate: activateNetwork,
    } = web3ContextInjected;

    providerStore.setWeb3Context(web3ContextNames.injected, web3ContextInjected);

    const web3React = providerStore.getActiveWeb3React();

    console.debug('[Web3ReactManager] Start of render', {
        injected: web3ContextInjected,
        web3React: web3React,
    });

    // try to eagerly connect to an injected provider, if it exists and has granted access already
    const triedEager = useEagerConnect();

    // after eagerly trying injected, if the network connect ever isn't active or in an error state, activate itd
    // TODO think about not doing this at all
    useEffect(() => {
        console.debug(
            '[Web3ReactManager] Activate injected if conditions are met',
            {
                triedEager,
                networkActive,
                networkError,
                activate:
                    triedEager &&
                    !networkActive &&
                    !networkError
            }
        );
        if (!networkActive && !networkError) {
            // activateNetwork(injected);
            console.debug('[Web3ReactManager] Backup activation started');
        }
    }, [
        triedEager,
        networkActive,
        networkError,
        activateNetwork
    ]);

    // 'pause' the network connector if we're ever connected to an account and it's active
    useEffect(() => {
        console.debug(
            '[Web3ReactManager] Pause injected if injected & injected both active',
            {
                networkActive,
                pause: networkActive,
            }
        );
        if (networkActive) {
            console.debug('[Web3ReactManager] Pause injected provider');
            // injected.pause();
        }
    }, [networkActive]);

    // 'resume' the network connector if we're ever not connected to an account and it's active
    useEffect(() => {
        console.debug(
            '[Web3ReactManager] Resume injected if injected not active & injected is active',
            {
                networkActive,
                resume: networkActive,
            }
        );
        if (networkActive) {
            console.debug('[Web3ReactManager] Resume injected provider');
            // injected.resume();
        }
    }, [networkActive]);

    // when there's no account connected, react to logins (broadly speaking) on the injected provider, if it exists
    useInactiveListener(!triedEager);

    //Fetch user blockchain data on an interval using current params
    useInterval(
        () => blockchainFetchStore.setFetchLoop(web3React, false),
        1000
    );

    useEffect(() => {
        if (
            web3React.account &&
            web3React.account !== providerStore.activeAccount
        ) {
            console.debug('[Fetch Loop] - Extra fetch on account switch', {
                account: web3React.account,
                prevAccount: providerStore.activeAccount,
            });
            blockchainFetchStore.setFetchLoop(web3React, true);
        }
    }, [web3React, providerStore.activeAccount, blockchainFetchStore]);

    // on page load, do nothing until we've tried to connect to the injected connector
    if (!triedEager) {
        console.debug('[Web3ReactManager] Render: Eager load not tried');
        return null;
    }

    const BlurWrapper = styled.div`
        filter: blur(1px);
    `;

    const OverBlurModal = styled.div`
      position: fixed;
      z-index: 1;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      overflow: auto;
      background-color: rgb(0,0,0);
      background-color: rgba(0,0,0,0.4);
      
      .connectModalContent {
        background-color: #fefefe;
        max-width: 350px;
        text-align: center;
        margin: 15% auto;
        padding: 20px;
        border-radius: 4px;
      }
    `;

    if (networkError) {
      console.debug('[Web3ReactManager] Render: Network error, showing modal error.');
      return (
        <div>
          <OverBlurModal>
            <div className="connectModalContent">Ups, something broke :(</div>
            </OverBlurModal>
            <BlurWrapper>
              {children}
            </BlurWrapper>
          </div>
        );
    } else if(!networkActive) {
        console.debug('[Web3ReactManager] Render: No active network, showing connect modal');
        return <div>{children[0]} <BlurWrapper> {children[1]} {children[2 ]} </BlurWrapper></div>; }

    console.debug( '[Web3ReactManager] Render: Active network, render children', { networkActive } );
    return children;
};

export default Web3ReactManager;
