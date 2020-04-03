import React, { useEffect, useRef } from 'react';

import styled from 'styled-components';

import Jazzicon from 'jazzicon';
import { useActiveWeb3React } from 'provider/providerHooks';

const StyledIdenticon = styled.div`
    height: 20px;
    width: 20px;
    border-radius: 1.125rem;
    background-color: ${({ theme }) => theme.silverGray};
`;

export default function Identicon() {
    const ref = useRef();

    const { account } = useActiveWeb3React();

    useEffect(() => {
        if (account && ref.current) {
            ref.current.innerHTML = '';
            ref.current.appendChild(
                Jazzicon(20, parseInt(account.slice(2, 10), 16))
            );
        }
    });

    return <StyledIdenticon ref={ref} />;
}
