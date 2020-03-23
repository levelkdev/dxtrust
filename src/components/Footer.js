import React from "react";
import styled from "styled-components";

const FooterWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  padding: 50px 0px 50px 0px;
  color: var(--footer-text-gray);
`;

const LeftFooter = styled.div`
  display: flex;
  flex-direction: row;
`;

const RighFooter = styled.div`
  display: flex;
  flex-direction: row;
`;

const FooterItem = styled.div`
  a {
    text-decoration: none;
    color: var(--footer-text-gray);
  }
`;

const FooterDivider = styled.div`
  background: var(--footer-text-gray);
  width: 4px;
  height: 4px;
  border-radius: 2px;
  line-height: 24px;
  margin: 7px;
`;

const LogoWrapper = styled.div`
  width: 20px;
  padding-left: 8px;
`;

const Logo = styled.img`
`;

const Footer = ({}) => {
	return (
		<FooterWrapper>
			<LeftFooter>
				<FooterItem>
					<a href="https://github.com/levelkdev/BC-DAPP/tree/3a96d989da119b5e610ae4f62d2f020b2acc8384" target="#">
            DXdao Version 3a96d98 - 10/24/19
					</a>
				</FooterItem>
				<FooterDivider></FooterDivider>
				<FooterItem>
					<a href="https://daotalk.org/c/daos/dx-dao" target="#">Forum</a>
				</FooterItem>
				<FooterDivider></FooterDivider>
				<FooterItem>
					<a href="https://alchemy.daostack.io/dao/0x519b70055af55a007110b4ff99b0ea33071c720a" target="#">Alchemy</a>
				</FooterItem>
			</LeftFooter>
			<RighFooter>
				<LogoWrapper>
					<a href="https://twitter.com/dxdao_" target="#">
						<Logo src="twitter.svg"></Logo>
					</a>
				</LogoWrapper>
				{ /* TODO get Reddit and Telegram logos for below */ }
				<LogoWrapper>
					<a href="https://www.reddit.com/r/dxdao/" target="#">
						<Logo src="reddit.svg"></Logo>
					</a>
				</LogoWrapper>
				<LogoWrapper>
					<a href="https://t.me/dxDAO" target="#">
						<Logo src="telegram.svg"></Logo>
					</a>
				</LogoWrapper>
			</RighFooter>
		</FooterWrapper>
	);
};

export default Footer;
