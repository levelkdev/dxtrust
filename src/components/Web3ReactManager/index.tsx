import React, { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import styled from 'styled-components';
import { backup, web3ContextNames } from 'provider/connectors';
import { useEagerConnect, useInactiveListener } from 'provider/providerHooks';
import { useStores } from 'contexts/storesContext';
import { useInterval } from 'utils/helperHooks';

const BLOKCHAIN_FETCH_INTERVAL = 3000;

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
        root: { providerStore, blockchainFetchStore },
    } = useStores();

    const web3ContextInjected = useWeb3React(web3ContextNames.injected);
    const web3ContextBackup = useWeb3React(web3ContextNames.backup);
    const { active: injectedActive } = web3ContextInjected;
    const {
        active: networkActive,
        error: networkError,
        activate: activateNetwork,
    } = web3ContextBackup;

    providerStore.setWeb3Context(web3ContextNames.injected, web3ContextInjected);
    providerStore.setWeb3Context(web3ContextNames.backup, web3ContextBackup);

    const web3React = providerStore.getActiveWeb3React();

    console.debug('[Web3ReactManager] Start of render', {
        injected: web3ContextInjected,
        backup: web3ContextBackup,
        web3React: web3React,
    });

    if (!networkActive && !networkError) {
        activateNetwork(backup);
        console.debug('[Web3ReactManager] Backup activation started');
    }

    // try to eagerly connect to an injected provider, if it exists and has granted access already
    const triedEager = useEagerConnect();

    // after eagerly trying injected, if the network connect ever isn't active or in an error state, activate itd
    // activate the network connector if we are not connected to an account and it's not active
    // 'pause' the network connector if we're ever connected to an account and it's active
    // 'resume' the network connector if we're ever not connected to an account and it's active
    useEffect(() => {
        console.debug(
            '[Web3ReactManager] Activate backup if conditions are met',
            {
                triedEager,
                networkActive,
                networkError,
                injectedActive,
            }
        );
        if (!networkActive && !networkError) {
            activateNetwork(backup);
            console.debug('[Web3ReactManager] Backup activation started');
        } else if (injectedActive && networkActive) {
            console.debug('[Web3ReactManager] Pause backup provider');
            backup.pause();
        } else if (!injectedActive && networkActive) {
            console.debug('[Web3ReactManager] Resume backup provider');
            backup.resume();
        }
    }, [
        triedEager,
        networkActive,
        networkError,
        activateNetwork,
        injectedActive,
    ]);

    // when there's no account connected, react to logins (broadly speaking) on the injected provider, if it exists
    useInactiveListener(!triedEager);

    // Fetch user blockchain data on an interval using current params
    blockchainFetchStore.setFetchLoop(web3React, true)
    useInterval(
        () => blockchainFetchStore.setFetchLoop(web3React, false),
        BLOKCHAIN_FETCH_INTERVAL
    );
    // Fetch when account or web3Provider changes
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

    // on page load, do nothing until we've tried to connect to the injected connector
    if (!triedEager) {
      console.debug('[Web3ReactManager] Render: Eager load not tried');
      return null;
    // Show message in network errore
    } else if (networkError) {
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
    // If network is not active show blur content
  } else if(!networkActive) {
        console.debug('[Web3ReactManager] Render: No active network');
        return (
          <div>
            <OverBlurModal>
              <div className="connectModalContent">Cant connect to network</div>
              </OverBlurModal>
              <BlurWrapper>
                {children}
              </BlurWrapper>
            </div>
          );
    } else {
      console.debug( '[Web3ReactManager] Render: Active network, render children', { networkActive } );
      return children;
    }

};

export default Web3ReactManager;
