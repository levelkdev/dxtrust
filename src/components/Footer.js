import React from 'react'
import styled from 'styled-components'

const FooterWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  padding: 50px 0px 50px 0px;
`

const LeftFooter = styled.div`
  display: flex;
  flex-direction: row;
`

const RighFooter = styled.div`
  display: flex;
  flex-direction: row;
`

const FooterItem = styled.div`
  color: var(--footer-text-gray);
`

const FooterDivider = styled.div`
  background: var(--footer-text-gray);
  width: 4px;
  height: 4px;
  border-radius: 2px;
  line-height: 24px;
  margin: 7px;
`

const LogoWrapper = styled.div`
  width: 24px;
  height: 24px;
  background: white;
  position: relative;
  border-radius: 12px;
  padding-left: 4px;
`

const Logo = styled.img`
  position: absolute;
  right: 1px;
  top: 1px;
`

const Footer = ({}) => {
  return (
    <FooterWrapper>
      <LeftFooter>
        <FooterItem>DXdao Version XXX.XXX - 09/27/19</FooterItem>
        <FooterDivider></FooterDivider>
        <FooterItem>Forum</FooterItem>
        <FooterDivider></FooterDivider>
        <FooterItem>Alchemy</FooterItem>
      </LeftFooter>
      <RighFooter>
        <LogoWrapper><Logo src="Twitter-logo.svg"></Logo></LogoWrapper>
        { /* TODO get Reddit and Telegram logos for below */ }
        <LogoWrapper><Logo src="Twitter-logo.svg"></Logo></LogoWrapper>
        <LogoWrapper><Logo src="Twitter-logo.svg"></Logo></LogoWrapper>
      </RighFooter>
    </FooterWrapper>
  )
}

export default Footer
