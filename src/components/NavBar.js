import React from 'react'
import styled from 'styled-components'

const NavWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  padding: 50px 0px 40px 0px;
`

const LeftNav = styled.div`
  display: flex;
  flex-direction: row;
`

const MenuItem = styled.div`
  color: var(--nav-text-light);
  line-height: 24px;
  padding: 0px 20px;
`

const SelectedMenuItem = styled.div`
  color: var(--nav-text-dark);
  line-height: 24px;
  padding: 0px 10px;
`

const LogoAndText = styled.div`
  display: flex;
  flex-direction: row;
  line-height: 24px;
  margin-right: 30px;
`

const LogoText = styled.div`
  margin-left: 10px;
  color: var(--nav-text-dark);
`

const LogoWrapper = styled.div`
  width: 24px;
  height: 24px;
  background: #667FE3;
  position: relative;
  border-radius: 12px;
`

const DXDLogo = styled.img`
  position: absolute;
  right: 1px;
  top: 1px;
`

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
`

const Avatar = styled.div`
  height: 17px;
  width: 17px;
  border-radius: 8px;
  background: #05575D;
  margin: 5px 10px 0px 10px;
`

const NavBar = ({}) => {
  return (
    <NavWrapper>
      <LeftNav>  
        <LogoAndText>
          <LogoWrapper>
            <DXDLogo src="DXD-logo.svg"></DXDLogo>
          </LogoWrapper>
          <LogoText>Dxdao</LogoText>
        </LogoAndText>
        <SelectedMenuItem>Exchange</SelectedMenuItem>
        <MenuItem>Rewards</MenuItem>
      </LeftNav>
      <Web3Connect>
        <Avatar></Avatar>
        <div>0x232b...8482</div>
      </Web3Connect>
    </NavWrapper>
  )
}

export default NavBar
