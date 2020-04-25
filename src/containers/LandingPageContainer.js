import React from 'react';
import LandingPage from '../components/LandingPage/LandingPage';
import LandingPageFooter from '../components/LandingPage/Footer';
import LandingPageHeader from '../components/LandingPage/Header';
import styled from 'styled-components';

const LandingPageWrapper = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
`;

const LandingPageContainer = ({}) => {
    return (
        <LandingPageWrapper>
          <LandingPageHeader />
          <LandingPage />
          <LandingPageFooter />
        </LandingPageWrapper>
    );
};

export default LandingPageContainer;
