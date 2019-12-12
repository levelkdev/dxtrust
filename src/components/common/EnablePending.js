  import React from 'react'
  import styled from 'styled-components'
  
  const ContentWrapper = styled.div`
    height: 200px;
    padding: 6px 0px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;  
  `

  const CircleContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
  `

  const EllipsesContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 48px;
    width: 48px;
    color: var(--pending-ellipses-purple);
    border-radius: 24px;
    border: 1px solid var(--panel-icon);
    margin-bottom: 16px;
  `

  const Ellipses = styled.div`
    height: 13px;
    width: 18px;
    margin-bottom: 12px;
  `

  const Title = styled.div`
    //font-family: SF Pro Text;
    font-size: 16px;
    line-height: 19px;
    letter-spacing: 0.4px;
    color: var(--panel-text);
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-bottom: 8px;
  `

  const SubTitle = styled.div`
    // font-family: SF Pro Text;
    font-size: 14px;
    line-height: 17px;
    letter-spacing: 0.4px;
    color: var(--pending-panel-text);
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-bottom: 27px;
  `
  
  const EnablePendingButton = styled.div`
    background-color: white;
    border: 1px solid var(--medium-gray);
    border-radius: 4px;
    color: var(--pending-text-gray);
    text-align: center;
    height: 34px;
    line-height: 34px;
    text-transform: uppercase;
  `

const EnablePending = ({tokenType, subtitleText}) => {
  return (
    <ContentWrapper>
      <CircleContainer>
        <EllipsesContainer>
          <Ellipses>...</Ellipses>
        </EllipsesContainer>
      </CircleContainer>
      <Title>Enable {tokenType} for trading</Title>
      <SubTitle>{subtitleText}</SubTitle>
      <EnablePendingButton>Enable {tokenType}</EnablePendingButton>
    </ContentWrapper>
  )
}

export default EnablePending
