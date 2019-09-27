import React from 'react'
import styled from 'styled-components'

const NavWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 50px 0px 40px 0px;
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
`

const NavBar = ({}) => {
  return (
    <NavWrapper>
      <LogoAndText>
        <LogoWrapper>
          <DXDLogo src="DXD-logo.svg"></DXDLogo>
        </LogoWrapper>
        <LogoText>Dxdao</LogoText>
      </LogoAndText>
      <SelectedMenuItem>Exchange</SelectedMenuItem>
      <MenuItem>Rewards</MenuItem>
    </NavWrapper>
  )
}

export default NavBar
