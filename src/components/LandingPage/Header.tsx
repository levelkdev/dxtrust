import React from 'react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import links from '../../links'


const NavWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    padding: 50px 0px 40px 0px;
`;

const LeftNav = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const RightNav = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const LogoContainer = styled.div`
    display: flex;
    align-items: center;
    color: var(--nav-text-light);
    font-size: 16px;
    line-height: 19px;
    cursor: pointer;
`;

const MenuItem = styled.a`
    font-family: Source Sans Pro;
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 20px;
    letter-spacing: 0.03em;
    color: var(--dark-text);
    cursor: pointer;
    margin-left: 42px;
    text-decoration: none;
`;

const NavBar = ({}) => {
    
    const NavItem = withRouter(
        ({ option, route, history, location, children }) => {
            return (
                <LogoContainer
                    onClick={() => {
                        history.push(route);
                    }}
                >
                    {children}
                </LogoContainer>
            );
        }
    );

    return (
        <NavWrapper>
            <LeftNav>
                <NavItem route="/">
                    <img src="Dxdao_Landing.svg"/>
                </NavItem>
            </LeftNav>
            <RightNav>
                <MenuItem href={links.header_governance} target="_blank">
                    Governance
                </MenuItem>
                <MenuItem href={links.header_chat} target="_blank">
                    Chat
                </MenuItem>
                <MenuItem href={links.header_forum} target="_blank">
                    Forum
                </MenuItem>
            </RightNav>
        </NavWrapper>
    );
};

export default NavBar;
