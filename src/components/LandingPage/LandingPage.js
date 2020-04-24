import React from 'react';
import styled from 'styled-components';

const LandingPageWrapper = styled.div`
`

const BannerSection = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
`

const TagLine = styled.div`
	font-family: Source Sans Pro;
	font-style: normal;
	font-weight: 600;
	font-size: 12px;
	line-height: 15px;
	text-align: center;
	text-transform: uppercase;
	color: var(--light-header-text);
`

const BannerMessage = styled.div`
	font-family: Raleway;
	font-style: normal;
	font-weight: 600;
	font-size: 44px;
	line-height: 52px;
	text-align: center;
	color: var(--dark-text);
	margin-top: 12px;
`

const Description = styled.div`
	font-family: Source Sans Pro;
	font-style: normal;
	font-weight: normal;
	font-size: 16px;
	line-height: 31px;
	text-align: center;
	letter-spacing: 0.03em;
	color: var(--light-body-text);
	margin-top: 32px;
	max-width: 614px;
`

const ButtonRow = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	margin-top: 32px;
`

const Button = styled.div`
	display: flex;
	justify-content: center;
	font-family: Source Sans Pro;
	font-style: normal;
	font-weight: bold;
	font-size: 14px;
	line-height: 18px;
	display: flex;
	align-items: center;
	text-align: center;
	letter-spacing: 0.02em;
	width: 120px;
	height: 43px;
	color: var(--dark-text);
	border: 1px solid rgba(51, 51, 51, 0.2);
	border-radius: 3px;
	margin: 0px 10px;
`

const DarkButton = styled(Button)`
	background: var(--dark-button-background);
	border: 1px solid rgba(0, 0, 0, 0.075);
	box-sizing: border-box;
	border-radius: 3px;
	color: var(--white);
`

///////


const ProductSection = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	margin-top: 124px;
`

const Message = styled.div`
	font-family: Raleway;
	font-style: normal;
	font-weight: 600;
	font-size: 24px;
	line-height: 28px;
	text-align: center;
	letter-spacing: 0.02em;
	color: var(--dark-text);
	margin-top: 16px;
`

const ProductPanelWrapper = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
	margin-top: 64px;
`

const ProductClickable = styled.a`
	display: block;
	text-decoration: none;
	
`

const ProductPanel = styled.div`
	display: flex;
	flex-direction: column;
	background: var(--white);
	border: 1px solid rgba(51, 51, 51, 0.2);
	border-radius: 3px;
	margin: 0px 10px;
	height: 187px;
	width: 233px;
	padding: 32px;
	&:hover {
		border: 1px solid #ADADAD;
	}
	
`

const ProductNameWrapper = styled.div`
	display: flex;
`

const ProductLogo = styled.img`
`

const ProductName = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	font-family: Raleway;
	font-style: normal;
	font-weight: 600;
	font-size: 22px;
	line-height: 26px;
	margin-left:16px;
	letter-spacing: 0.02em;
	color: var(--dark-text);
`

const ProductDescription = styled.div`
	font-family: Source Sans Pro;
	font-style: normal;
	font-weight: normal;
	font-size: 14px;
	line-height: 27px;
	letter-spacing: 0.03em;
	margin-top: 32px;
	color: var(--light-body-text);
`

///////

const AboutUsSection = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	margin-top: 124px;
`

const AboutPanelWrapper = styled.div`
	display: flex;
	flex-direction: row;
	margin-top: 64px;
`

const AboutPanel = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: start;
	width: 25%;
	margin: 0px 22px;
`

const AboutIcon = styled.img`
`

const AboutHeader = styled.div`
	font-family: Source Sans Pro;
	font-style: normal;
	font-weight: bold;
	font-size: 16px;
	line-height: 28px;
	letter-spacing: 0.03em;
	text-align: center;
	margin-top: 32px;
`

const AboutDescription = styled.div`
	font-family: Source Sans Pro;
	font-style: normal;
	font-weight: 600;
	font-size: 16px;
	line-height: 28px;
	text-align: center;
	color: var(--light-body-text);
	margin-top: 24px;
`

///////

const JoinSection = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top: 124px;
`
const JoinActionWrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top: 32px;
`

const JoinAction = styled.div`
	font-family: Source Sans Pro;
	font-style: normal;
	font-weight: bold;
	font-size: 18px;
	line-height: 18px;
	align-items: center;
	letter-spacing: 0.02em;
	color: #189DDF;
`

const JoinActionText = styled.div`
`

const JoinActionArrow = styled.img`
`

const EmailSignUp = styled.div`
	font-family: Source Sans Pro;
	font-style: normal;
	font-weight: normal;
	font-size: 14px;
	line-height: 18px;
	height: 40px;
	width: 284px;
	border: 1px solid rgba(51, 51, 51, 0.2);
	border-radius: 4px;
	color: var(--light-body-text);
	margin-top: 32px;
`


const LandingPage = () => {
	return(
		<LandingPageWrapper>
			<BannerSection>
				<TagLine>
					We decentralize DeFi
				</TagLine>
				<BannerMessage>
					<b>Dxdao </b>
					is a
					<b> sovereign collective</b>
				</BannerMessage>
				<Description>
					The dxDAO is a decentralized organization initialized in May of 2019
					and has over 400 unique stakeholder addresses. It develops, governs,
					and grows DeFi protocols and products. Owned and operated by the 
					community, the Dxdao has the potential to significantly scale its
					membership.
				</Description>
				<ButtonRow>
					<DarkButton>
						Invest
					</DarkButton>
					<Button>
						Join
					</Button>
					<Button>
						Whitepaper
					</Button>
				</ButtonRow>
			</BannerSection>
			<ProductSection>
				<TagLine>
					Our collectively owned products
				</TagLine>
				<Message>
					Pure Dapps powered by Dxdao
				</Message>
				<ProductPanelWrapper>
					<ProductClickable href="https://daotalk.org/t/mix-eth-seeking-feedback-on-proposal/1183" target="_blank">
						<ProductPanel>
							<ProductNameWrapper>
								<ProductLogo src='Mix.svg' />
								<ProductName>Mix.eth</ProductName>
							</ProductNameWrapper>
							<ProductDescription>
								Mix is a portfolio manager for the Ethereum ecosystem with privacy,
								security, and a good user experience as core features.
							</ProductDescription>
						</ProductPanel>
					</ProductClickable>
					<ProductClickable href="https://daotalk.org/t/omen-mvp-overview/1229" target="_blank">
					<ProductPanel>
						<ProductNameWrapper>
							<ProductLogo src='Omen.svg' />
							<ProductName>Omen.eth</ProductName>
						</ProductNameWrapper>
						<ProductDescription>
							Omen is a fully decentralized prediction market platform
							built on top of the Gnosis conditional token framework.
						</ProductDescription>
					</ProductPanel>
					</ProductClickable>
					<ProductClickable href="https://mesa.eth.link" target="_blank">
							<ProductPanel>
									<ProductNameWrapper>
										<ProductLogo src='Mesa.svg' />
										<ProductName>Mesa.eth</ProductName>
									</ProductNameWrapper>
									<ProductDescription>
										Mesa is an Open Source interface for the Gnosis Protocol,
										a fully permissionless DEX that enables ring trades to maximize liquidity.
									</ProductDescription>
							</ProductPanel>
							</ProductClickable>
				</ProductPanelWrapper>
			</ProductSection>
			<AboutUsSection>
				<TagLine>
					About us
				</TagLine>
				<Message>
					The first super-scalable collective
				</Message>
				<AboutPanelWrapper>
					<AboutPanel>
						<AboutIcon src='No-Hierarchy.svg' />
						<AboutHeader>
							No Hierarchies
						</AboutHeader>
						<AboutDescription>
							There is no boss. Members find consensus through voting.
						</AboutDescription>
					</AboutPanel>
					<AboutPanel>
						<AboutIcon />
						<AboutHeader>
							Symmetry of Information
						</AboutHeader>
						<AboutDescription>
							Equal access to information for all members.
						</AboutDescription>
					</AboutPanel>
					<AboutPanel>
						<AboutIcon />
						<AboutHeader>
							Swarm Knowledge
						</AboutHeader>
						<AboutDescription>
							The transparent feedback system enables decision
							making with a high degree of success.
						</AboutDescription>
					</AboutPanel>
					<AboutPanel>
						<AboutIcon />
						<AboutHeader>
							Open for Everyone
						</AboutHeader>
						<AboutDescription>
							Permissionless access increases the knowledge and
							effectiveness of the collective.
						</AboutDescription>
					</AboutPanel>
				</AboutPanelWrapper>
			</AboutUsSection>
			<JoinSection>
				<Message>
					Join now
				</Message>
				<JoinActionWrapper>
					<JoinAction>
						<JoinActionText>
							Create a proposal
						</JoinActionText>
						<JoinActionArrow />
					</JoinAction>
					<JoinAction>
						<JoinActionText>
							Start a forum discussion
						</JoinActionText>
						<JoinActionArrow />
					</JoinAction>
					<JoinAction>
						<JoinActionText>
							Community chat
						</JoinActionText>
						<JoinActionArrow />
					</JoinAction>
					<JoinAction>
						<JoinActionText>
							Developer chat
						</JoinActionText>
						<JoinActionArrow />
					</JoinAction>
				</JoinActionWrapper>
				<EmailSignUp />
			</JoinSection>
		</LandingPageWrapper>
	);
};

export default LandingPage;