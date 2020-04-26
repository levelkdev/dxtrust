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
                This is the first Dxdao fundraising round. DXD is a brand new
                token. Purchasers of DXD are funding the efforts of the Dxdao in
                exchange for a right to future cash flows. DXD tokens will be
                sold to the public in exchange for ETH according to a bonding
                curve. The curve slope is linear and positive, so each
                successive DXD is sold for more than the previous. DXD can also
                be sold back into the curve, although at a different, lower rate
                than purchases. In this fundraising round, our goal is to raise
                $300,000 USD worth of ETH. This amount raised would equate to
                12,000 DXD tokens having been sold from the curve. The Dxdao
                itself will receive an initial pre-mint of 100,000 DXD tokens.
                Thus, the 12,000 DXD sold in this round represents just under
                11% of the DXD supply. The 100,000 DXD issued to the Dxdao will
                vest monthly over 3 years (i.e. 1/36th = ~2775 DXD will be
                vested each month for 36 months). Before the curve turns into a
                positively sloping function, there is a flat section of the
                curve where the first $50,000 raised will be for DXD sold at a
                lower, constant price. This $50,000 period also acts as a
                'kickstarter', wherein any amount invested can be withdrawn
                before the $50,000 is reached. (All USD denominations above are
                in ETH terms using current prices.)
            </Description>
            <BannerMessage>Reserve percentage</BannerMessage>
            <Description>
                A portion of the ETH used to buy DXD is held in reserve to
                facilitate sell orders of DXD. The ETH is effectively placed
                into the curve, providing a liquidity guarantee for those who
                want to sell DXD. The portion of invested capital placed in
                reserve is set at 10%. This is so because investors in DXD want
                their money to be used to grow the Dxdao, not sit in reserve.
                Thus it is more of a last liquidity backstop.
            </Description>
            <BannerMessage>Dividend percentage</BannerMessage>
            <Description>
                A portion of Dxdao revenue is allocated to the reserve,
                increasing the value of all outstanding bonding curve tokens.
                This is currently set at 10% of revenue, for a minimum of 5
                years. The revenue allocation here can be increased at a later
                date, but never decreased.
            </Description>
        </section>
    );
};
export default FAQPage;
