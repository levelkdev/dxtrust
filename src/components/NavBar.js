import React from 'react'
import { withRouter } from 'react-router-dom'
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
  cursor: pointer;
`

const SelectedMenuItem = styled.div`
  color: var(--nav-text-dark);
  line-height: 24px;
  padding: 0px 10px;
  cursor: pointer;
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
  const [selected, setSelected] = React.useState(0)

  const NavItem = withRouter(
    ({
      option, route, history, location, children
    }) => {
      // Handle external route navigation
      if (location.pathname === route) {
        setSelected(option)
      } else if (location.pathname === '/') {
        setSelected(1)
      }

      if (option === selected) {
        return (
          <SelectedMenuItem>
            {children}
          </SelectedMenuItem>
        )
      }
      return (
        <MenuItem onClick={() => {
          setSelected(option)
          history.push(route)
        }}
        >
          {children}
        </MenuItem>
      )
    }
  )

  return (
    <NavWrapper>
      <LeftNav>  
        <LogoAndText>
          <LogoWrapper>
            <DXDLogo src="DXD-logo.svg"></DXDLogo>
          </LogoWrapper>
          <LogoText>Dxdao</LogoText>
        </LogoAndText>
        <NavItem option={1} route="/exchange">
          Exchange
        </NavItem>
        <NavItem option={2} route="/redeem">
          Rewards
        </NavItem>
      </LeftNav>
      <Web3Connect>
        <Avatar></Avatar>
        <div>0x232b...8482</div>
      </Web3Connect>
    </NavWrapper>
  )
}

export default NavBar
