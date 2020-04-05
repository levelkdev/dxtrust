import React from 'react';
import styled from 'styled-components';

const Pill = styled.div`
    background: #FFFFFF;
    border: 1px solid #E1E3E7;
    box-sizing: border-box;
    box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.15);
    border-radius: 6px;

    display: flex;
    justify-content: space-evenly;
    align-items: center;
    text-align: center;

    font-family: var(--roboto);
    color: var(--dark-text-gray);
    font-style: normal;
    font-weight: 500;
    font-size: 15px;
    line-height: 16px;
    letter-spacing: 0.2px;
    cursor: pointer;

    width: 166px;
    height: 40px;
`;

const Web3PillBox = ({ children, onClick }) => {
    return <Pill onClick={onClick}>{children}</Pill>;
};

export default Web3PillBox;
