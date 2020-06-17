import React from 'react';
import styled from 'styled-components';

// UI Components
import Accordion from './Accordion';

// Content
import FAQ_DATA from '../misc/faq';

const BannerMessage = styled.div`
    font-family: Raleway;
    font-style: normal;
    font-weight: 600;
    font-size: 24px;
    line-height: 28px;
    text-align: left;
    letter-spacing: 0.02em;
    color: var(--dark-text);
    padding-left: 24px;
    margin-top: 14px;
    margin-bottom: 32px;
`;

const Description = styled.div`
    font-family: Source Sans Pro;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 31px;
    text-align: left;
    letter-spacing: 0.03em;
    color: var(--light-body-text);
    padding: 0px 48px 24px 24px;
`;

const FAQPage = () => {
    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <section className="Content FAQ">
            <main className="Container">
                <BannerMessage>Frequently Asked Questions</BannerMessage>
                <div>
                    <ul className="List">
                        {FAQ_DATA.map((pair, key) => (
                            <li key={key} className="ListItem">
                                <Accordion
                                    headline={pair.question}
                                    content={pair.answer}
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            </main>
            <BannerMessage>DXD Distribution and Details</BannerMessage>
            <Description>
                <pre>
                The DXdao is issuing DXD token through a continuous fundraiser. The DXD token is a brand new token. Purchasers of DXD are funding the efforts of the DXdao and receiving a stake in its future success.
                DXD tokens will be sold to the public in exchange for ETH according to a bonding curve. The curve slope is linear and positive, so each successive DXD is sold for more than the previous. DXD can also be sold back into the curve, although at a lower rate than purchased.
                <br/>
                <br/>
                The DXdao itself received an initial pre-mint of 100,000 DXD tokens. The 100,000 DXD issued to the DXdao is vesting continuously over 3 years (i.e. 1/36th = ~2775 DXD will be vested each month for 36 months).
                </pre>
            </Description>
            <BannerMessage>Reserve percentage</BannerMessage>
            <Description>
                90% of funds invested is sent to the DXdao and used to grow its ventures.  The rest is deposited into the bonding curve's buyback reserve.  The buyback reserve supports redemption of DXD for ETH, but initially is a very small percentage of the buy price, and so it is unlikely to make sense to sell into the bonding curve for some time.
            </Description>
            <BannerMessage>How DXdao's revenues are connected with the bonding curve</BannerMessage>
            <Description>
                Revenues generated from the Dxdao’s product will be routed to the curve. The curve is programmed to split the revenues such that 10% goes towards the buyback reserve to incentivize token burn, and 90% goes to the treasury.
            </Description>
        </section>
    );
};
export default FAQPage;
