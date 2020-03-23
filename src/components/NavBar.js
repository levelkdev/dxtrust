import React from "react";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import Web3ConnectButton from "./common/Web3ConnectButton";

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
  padding: 0px 12px;
  cursor: pointer;
`;

const SelectedMenuItem = styled(MenuItem)`
  color: var(--nav-text-dark);
  line-height: 24px;
  padding: 0px 10px;
  cursor: pointer;
`;

const DXDLogo = styled.img`
  margin-right: 37px;
`;

const Web3Connect = styled.div`
  display: flex;
  flex-direction: row;
  font-size: 14px;
  height: 28px;
  line-height: 28px;
  padding: 0px 15px;
  border: 1px solid var(--medium-gray);
  border-radius: 4px;
  background: white;
  color: #546E7A;
`;

const Avatar = styled.div`
  height: 17px;
  width: 17px;
  border-radius: 8px;
  background: #05575D;
  margin: 5px 10px 0px 10px;
`;

const NavBar = ({}) => {
	const [selected, setSelected] = React.useState(0);

	const NavItem = withRouter(
		({
			option, route, history, location, children
		}) => {
			// Handle external route navigation
			if (location.pathname === route) {
				setSelected(option);
			} else if (location.pathname === "/") {
				setSelected(1);
			}

			if (option === selected) {
				return (
					<SelectedMenuItem>
						{children}
					</SelectedMenuItem>
				);
			}
			return (
				<MenuItem onClick={() => {
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
				<NavItem route="/"><DXDLogo src="DXdao.svg"></DXDLogo></NavItem>
				<NavItem option={1} route="/exchange">
          Exchange
				</NavItem>
				<NavItem option={2} route="/redeem">
          Rewards
				</NavItem>
			</LeftNav>
			<Web3ConnectButton>
				<Avatar></Avatar>
				<div>0x232b...8482</div>
			</Web3ConnectButton>
		</NavWrapper>
	);
};

export default NavBar;
