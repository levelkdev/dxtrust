import React from 'react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import Web3ConnectStatus from './Web3ConnectStatus';

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

const MenuItem = styled.div`
    display: flex;
    align-items: center;
    color: var(--nav-text-light);
    font-size: 16px;
    line-height: 19px;
    cursor: pointer;
`;

const SelectedMenuItem = styled(MenuItem)`
    color: var(--nav-text-dark);
    line-height: 24px;
    cursor: pointer;
`;

/*
const MenuItem = styled.div`
    display: flex;
    align-items: center;
    color: var(--nav-text-light);
    font-size: 16px;
    line-height: 19px;
    padding: 0px 12px;
    cursor: pointer;
`;

const SelectedMenuItem = styled(MenuItem)`
    color: var(--nav-text-dark);
    line-height: 24px;
    padding: 0px 12px;
    cursor: pointer;
`;
const DXDLogo = styled.img`
    margin-right: 17px;
`;
*/
const NavBar = ({}) => {
    const [selected, setSelected] = React.useState(0);

    const NavItem = withRouter(
        ({ option, route, history, location, children }) => {
            // Handle external route navigation
            if (location.pathname === route) {
                setSelected(option);
            } else if (location.pathname === '/') {
                setSelected(1);
            }

            if (option === selected) {
                return <SelectedMenuItem>{children}</SelectedMenuItem>;
            }
            return (
                <MenuItem
                    onClick={() => {
                        setSelected(option);
                        history.push(route);
                    }}
                >
                    {children}
                </MenuItem>
            );
        }
    );

    return (
        <NavWrapper>
            <LeftNav>
                <NavItem route="/">
                <img src="DXdao.svg"/>
                    {/*<DXDLogo src="DXdao.svg"></DXDLogo>*/}
                </NavItem>
               {/* <NavItem option={1} route="/exchange">
                    Exchange
                </NavItem>
                <NavItem option={2} route="/redeem">
                    Rewards
        </NavItem> */}
            </LeftNav>
            <Web3ConnectStatus text="Connect Wallet" />
        </NavWrapper>
    );
};

export default NavBar;
