import React from 'react';
import styled from 'styled-components';

import Footer from '../components/Footer';
import NavBar from '../components/NavBar';
import Holders from '../components/Holders';

const DashboardWrapper = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
`;

const Dashboard = () => {
    return (
        <DashboardWrapper>
            <NavBar />
            <Holders />
            <Footer />
        </DashboardWrapper>
    );
};

export default Dashboard;
