import React from 'react';
import styled from 'styled-components';
import { Line } from 'react-chartjs-2';
import { observer } from 'mobx-react';
import { useStores } from '../../contexts/storesContext';
import {
    denormalizeBalance,
    formatBalance,
    formatNumberValue,
    normalizeBalance,
} from '../../utils/token';
import { BigNumber } from '../../utils/bignumber';
import { validateTokenValue, ValidationStatus } from '../../utils/validators';
import { bnum } from '../../utils/helpers';
import { roundUpToScale } from '../../utils/number';
import { pointTooltips } from './pointTooltips';

const ChartPanelWrapper = styled.div`
    max-width: 610px;
    width: calc(66%);
    background-color: white;
    border: 1px solid #EBE9F8;
    box-sizing: border-box;
    box-shadow: 0px 2px 10px rgba(14, 0, 135, 0.03), 0px 12px 32px rgba(14, 0, 135, 0.05);
    border-radius: 8px;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    margin-right:10px;
    
    .loader {
      height: 100%;
      padding-top: 150px;
      text-align: center;
      font-family: Roboto;
      font-style: normal;
      font-weight: 500;
      font-size: 15px;
      line-height: 18px;
      color: #BDBDBD;
      
      img {
        margin-bottom: 10px;
      }
    }
    
    ${({ theme }) => theme.mediaWidth.upToMedium`
      width: calc(30%);
    `};
`;

const ChartHeaderWrapper = styled.div`
    display: flex;
    padding: 0px 15px;
    flex-wrap: wrap;
    height: 45px;
    justify-content: space-around;
    border-bottom: 1px solid var(--line-gray);
    padding: 20px 0px;
    ${({ theme }) => theme.mediaWidth.upToMedium`
      flex-direction: column;
      border-bottom: none;
    `};
`;

const ChartHeaderFullElement = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: calc((100% - 20) / 3);
    color: var(--dark-text-gray);
    ${({ theme }) => theme.mediaWidth.upToMedium`
      text-align: center;
      width: 100%;
    `};
`;

const ChartHeaderTopElement = styled.div`
    font-size: 14px;
    font-weight: 500;
    color: var(--light-text-gray);
`;

const ChartHeaderBottomElement = styled.div`
    font-size: 16px;
    margin-top: 10px;
    font-weight: 500;
    color: 1px solid var(--line-gray);
`;

const PriceBottomElement = styled(ChartHeaderBottomElement)`
    color: '1px solid var(--line-gray)';
`

const ChartWrapper = styled.div`
    height: 250px;
    padding: 20px 20px 0px 20px;
    ${({ theme }) => theme.mediaWidth.upToMedium`
      display: none;
    `};
`;

interface ChartPointMap {
    [index: string]: ChartPoint;
}

enum PointType {
    ZERO,
    KICKSTARTER_START,
    KICKSTARTER_END,
    CURRENT_BUY_PRICE,
    CURRENT_SELL_PRICE,
    FUTURE_SUPPLY,
    CURVE_START,
    MAX_BUY_SUPPLY_TO_SHOW,
    MAX_SELL_SUPPLY_TO_SHOW
}

interface ChartPoint {
  x: number;
  y: number;
  type: PointType
}

const chartBlue = '#304AFA';
const chartRed = '#D8494A';
const chartGray = '#9FA8DA';
const gridLineColor = '#EAECF7';

const BondingCurveChart = observer((totalSupplyWithoutPremint:BigNumber) => {
    const {
        root: { tradingStore, tokenStore, configStore, datStore, providerStore },
    } = useStores();

    let initGoal: BigNumber,
    preMintedTokens: BigNumber,
    currentBuyPrice: BigNumber,
    currentSellPrice: BigNumber,
    kickstarterPrice: BigNumber;
    
    const activeDATAddress = configStore.getTokenAddress();
    const staticParamsLoaded = datStore.areAllStaticParamsLoaded();
    const totalSupplyWithPremint = tokenStore.getTotalSupply(activeDATAddress);
    const burnedSupply = tokenStore.getBurnedSupply(activeDATAddress);
    const investmentReserveBasisPoints = datStore.getInvestmentReserveBasisPoints()

    const currrentDatState = datStore.getState();
    const reserveBalance: BigNumber = datStore.getReserveBalance();
    const isBuy = tradingStore.activeTab === 'buy';
    
    const { active: providerActive } = providerStore.getActiveWeb3React();

    const requiredDataLoaded =
        staticParamsLoaded &&
        !!totalSupplyWithPremint &&
        currrentDatState !== undefined &&
        !!reserveBalance;

    if (requiredDataLoaded) {
        initGoal = datStore.getInitGoal();
        preMintedTokens = datStore.getPreMintedTokens();

        if (initGoal && initGoal.gt(0)) {
            kickstarterPrice = datStore.getBuyPriceAtSupply(initGoal.div(2));
        }
    
        totalSupplyWithoutPremint = totalSupplyWithPremint.minus(preMintedTokens).plus(burnedSupply);
        currentSellPrice = datStore.getSellPrice();
        currentBuyPrice = datStore.getBuyPrice();
    }

    let chartData, chartOptions;

    const generateLine = (chartData: ChartPoint[], color: string, label: string, dashed: boolean, bgColor?: string) => {
        return {
          label,
          fill: !dashed,
          data: chartData,
          datalabels: {
            display: false,
          },
          borderWidth: 2,
          pointRadius: (context) => {
            const point = context.dataset.data[context.dataIndex];

            if ((point.type === PointType.CURRENT_BUY_PRICE) || (point.type === PointType.CURRENT_SELL_PRICE)) {
              return 4;
            } else {
              return 2;
            }
          },
          borderColor: () => {
            return color;
          },
          backgroundColor: bgColor || "transparent",
          borderDash: dashed ? [10, 10] : [],
          lineTension: 0,
        };
    };

    const generateSupplyMarker = (point: ChartPoint, label: string, color) => {
        return {
            label,
            fill: false,
            data: [point],
            pointRadius: 7,
            pointBackgroundColor: color,
            borderWidth: 1,
            pointBorderColor: color,
            lineTension: 0,
        };
    };

    const balanceToNumber = (balance: BigNumber) => {
        return normalizeBalance(balance).toNumber();
    };

    const valueToNumber = (value: BigNumber) => {
        return value.toNumber();
    };

    const generateChart = () => {
      const datasets = [], hasInitGoal = initGoal.gt(0), hasExceededInitGoal = datStore.isRunPhase();
      let supplyIncrease, futureSupply, futurePrice = bnum(0), hasActiveInput = false;
      let maxBuySupplyToShow = totalSupplyWithoutPremint.times(1.5);
      let maxSupplyToShow = denormalizeBalance(
        roundUpToScale(normalizeBalance(maxBuySupplyToShow))
      );
      if (maxSupplyToShow.lt(initGoal.times(1.5))) {
        maxBuySupplyToShow = totalSupplyWithoutPremint.plus(initGoal)
        maxSupplyToShow = denormalizeBalance(
          roundUpToScale( normalizeBalance( maxBuySupplyToShow ) )
        );
      }
      const maxBuyPriceToShow = datStore.getBuyPriceAtSupply(maxSupplyToShow);
      const reserveBalanceAtMaxSellPriceToShow = maxBuySupplyToShow.minus(totalSupplyWithoutPremint)
        .times(maxBuyPriceToShow)
        .div(bnum(10000).div(investmentReserveBasisPoints))
        .plus(reserveBalance);
      const maxSellPriceToShow = datStore.getSellPriceAtSupplyWithReserve(
        maxBuySupplyToShow, reserveBalanceAtMaxSellPriceToShow
      );

      let points: ChartPointMap = {
        zero: {
          x: 0,
          y: 0,
          type: PointType.ZERO
        },
        currentBuyPrice: {
          x: balanceToNumber(totalSupplyWithoutPremint),
          y: valueToNumber(currentBuyPrice),
          type: PointType.CURRENT_BUY_PRICE
        },
        currentSellPrice: {
          x: balanceToNumber(totalSupplyWithoutPremint),
          y: valueToNumber(currentSellPrice),
          type: PointType.CURRENT_SELL_PRICE
        },
      };

      if (hasInitGoal) {
        points.kickStarterStart = {
          x: 0,
          y: valueToNumber(kickstarterPrice),
          type: PointType.KICKSTARTER_START
        };

        points.kickstarterEnd = {
          x: balanceToNumber(initGoal),
          y: valueToNumber(kickstarterPrice),
          type: PointType.KICKSTARTER_END
        };

        points.curveStart = {
          x: balanceToNumber(initGoal),
          y: valueToNumber(kickstarterPrice.times(2)),
          type: PointType.CURVE_START
        };
      }

      points.maxBuySupplyToShow = {
        x: balanceToNumber(maxSupplyToShow),
        y: valueToNumber(maxBuyPriceToShow),
        type: PointType.MAX_BUY_SUPPLY_TO_SHOW
      };
      
      points.maxSellSupplyToShow = {
        x: balanceToNumber(maxSupplyToShow),
        y: valueToNumber(maxSellPriceToShow),
        type: PointType.MAX_SELL_SUPPLY_TO_SHOW
      };

      if (
        validateTokenValue(tradingStore.buyAmount) ===
        ValidationStatus.VALID
      ) {
        supplyIncrease = tradingStore.payAmount;
        futureSupply = totalSupplyWithoutPremint.plus(supplyIncrease);
        futurePrice = datStore.getBuyPriceAtSupply(futureSupply);
        points['futureSupply'] = {
          x: balanceToNumber(futureSupply),
          y: valueToNumber(futurePrice),
          type: PointType.FUTURE_SUPPLY
        };

        hasActiveInput = true;

        if (futureSupply.gte(maxSupplyToShow)) {
          const newMaxSupplyToShow = denormalizeBalance(
            roundUpToScale(normalizeBalance(futureSupply.times(1.5)))
          );
          const newMaxPriceToShow = datStore.getBuyPriceAtSupply(
            newMaxSupplyToShow
          );

          points.maxBuySupplyToShow = {
            x: balanceToNumber(newMaxSupplyToShow),
            y: valueToNumber(newMaxPriceToShow),
            type: PointType.MAX_BUY_SUPPLY_TO_SHOW
          };
        }
      }

      // console.debug('chartParams', {
      //   datParams: datStore.datParams[],
      //   preMintedTokens: preMintedTokens.toString(),
      //   initGoal: initGoal.toString(),
      //   buySlopeNum: buySlopeNum.toString(),
      //   buySlopeDen: buySlopeDen.toString(),
      //   currentBuyPrice: totalSupplyWithoutPremint.toString(),
      // 
      //   hasInitGoal,
      //   hasExceededInitGoal,
      //   points,
      // });

      if (hasInitGoal && !hasExceededInitGoal) {
        datasets.push(
          generateLine(
            [ points.kickStarterStart, points.currentBuyPrice, points.kickstarterEnd ],
            chartRed,
            'Kickstarter Price',
            false
          )
        );
      }

      if (hasExceededInitGoal) {
        datasets.push(
          generateLine(
            [points.zero, points.currentBuyPrice],
            chartBlue,
            'Buy Price',
            false,
            "#F2F1FE"
          )
        );
        
        datasets.push(
          generateLine(
            [points.currentBuyPrice, points.maxBuySupplyToShow],
            chartBlue,
            'Future Buy Price',
            true
          )
        );
        
        datasets.push(
          generateLine(
            [points.zero, points.currentSellPrice],
            chartRed,
            'Sell Price',
            false,
            "#F5E7E7"
          )
        );
        
        datasets.push(
          generateLine(
            [points.currentSellPrice,  points.maxSellSupplyToShow],
            chartRed,
            'Future Sell Price',
            true
          )
        );
        
        
      } else {
        datasets.push(
          generateLine(
            [points.kickstarterEnd, points.curveStart],
            chartGray,
            'Kickstarter Ends',
            false
          )
        );
        
        datasets.push(
          generateLine(
            [points.curveStart, points.maxBuySupplyToShow],
            chartBlue,
            'Buy Price',
            true
          )
        );

      }

      if (hasActiveInput) {
        datasets.push(
          generateSupplyMarker(
            points.futureSupply,
            'Future Supply',
            chartBlue
          )
        );
      }

      chartData = {
        datasets,
        backgroundColor: '#000000',
      };

      chartOptions = {
        tooltips: {
          enabled: false,
          custom: pointTooltips,
          filter: (tooltipItem) => {
            return (tooltipItem.index === 1 || tooltipItem.index === 2);
          },
          callbacks: {
            // tslint:disable-next-line: no-shadowed-variable
            label: (tooltipItem, data) => {
              let toDisplay = (tooltipItem.index === 1 ) ? data.datasets[tooltipItem.datasetIndex].label 
                : 'Future ' + data.datasets[tooltipItem.datasetIndex].label;
              toDisplay += ': '+ tooltipItem.yLabel.toFixed(3) + ' ETH / DXD';
              return toDisplay;
            },
          },
        },
        maintainAspectRatio: false,
        legend: { display: false, },
        scales: {
          xAxes: [{
            type: 'linear',
            display: true,
            gridLines: {
              display: false,
            },
            scaleLabel: {
              display: true,
              labelString: ' DXD',
            },
            ticks: {
              beginAtZero: true,
              max: points.maxBuySupplyToShow.x,
              major: {
                fontStyle: 'bold',
                fontColor: '#BDBDBD',
              }
            },
          }],
          yAxes: [{
            display: true,
            gridLines: {
              display: true,
              color: gridLineColor,
            },
            position: 'right',
            ticks: {
              beginAtZero: true,
              suggestedMax: points.maxBuySupplyToShow.y,
              callback: (value) => {
                return (
                  formatNumberValue(bnum(value), 3) + ' ETH'
                );
              },
            },
            scaleLabel: {
              display: true,
              labelString: '',
            },
          }],
        },
      };

    };

    if (requiredDataLoaded) {
      generateChart();
    }

    /*
        Draw a strait line for the inital goal. The PRICE for this is the slope for total supply 0
        We may have to hardcode this value...

        It's a slope but I DON"T understand because it's 1 / 10^18!!!! And it seems to be about 1/3 of tokens.
     */

    const renderChartHeader = () => {
      if (datStore.isInitPhase()) {
        return renderInitPhaseChartHeader();
      } else if (datStore.isRunPhase()) {
        return renderRunPhaseChartHeader();
      } else {
        return <React.Fragment />;
      }
    };

    const renderInitPhaseChartHeader = () => {
      return (
        <ChartHeaderWrapper>
            <ChartHeaderFullElement>
              <ChartHeaderTopElement>{isBuy ? 'Buy Price' : 'Sell Price'}</ChartHeaderTopElement>
              <ChartHeaderBottomElement>
                {requiredDataLoaded ? `${formatNumberValue(kickstarterPrice)} ETH` : '- ETH'}
              </ChartHeaderBottomElement>
            </ChartHeaderFullElement>
            <ChartHeaderFullElement>
              <ChartHeaderTopElement>Invested</ChartHeaderTopElement>
              <ChartHeaderBottomElement className="green-text">
                {requiredDataLoaded ? `${formatBalance(totalSupplyWithoutPremint.times(kickstarterPrice), 18, 4, false)} ETH` : '- ETH'}
              </ChartHeaderBottomElement>
            </ChartHeaderFullElement>
            <ChartHeaderFullElement>
              <ChartHeaderTopElement>Goal</ChartHeaderTopElement>
              <ChartHeaderBottomElement>
                {requiredDataLoaded ? `${formatBalance( initGoal.times(kickstarterPrice) )} ETH` : '- ETH'}
              </ChartHeaderBottomElement>
            </ChartHeaderFullElement>
            <ChartHeaderFullElement>
              <ChartHeaderTopElement>
                Curve Issuance
              </ChartHeaderTopElement>
              <ChartHeaderBottomElement>
                {requiredDataLoaded ? `${formatBalance( totalSupplyWithoutPremint )} DXD` : '- DXD'}
              </ChartHeaderBottomElement>
            </ChartHeaderFullElement>
        </ChartHeaderWrapper>
      );
    };

    const renderRunPhaseChartHeader = () => {
      return (
        <ChartHeaderWrapper>
            <ChartHeaderFullElement>
              <ChartHeaderTopElement><span style={{color: "#304AFA"}}>|</span> Buy Price</ChartHeaderTopElement>
                <PriceBottomElement isBuy={true} >
                  {requiredDataLoaded ? `${formatNumberValue(currentBuyPrice)} ETH` : '- DXD/ETH' }
                </PriceBottomElement>
              </ChartHeaderFullElement>
            <ChartHeaderFullElement>
              <ChartHeaderTopElement><span style={{color: "#D8494A"}}>|</span> Sell Price</ChartHeaderTopElement>
                <PriceBottomElement isBuy={false} >
                  {requiredDataLoaded ? `${formatNumberValue(currentSellPrice)} ETH` : '- DXD/ETH' }
                </PriceBottomElement>
            </ChartHeaderFullElement>
        </ChartHeaderWrapper>
      );
    };

    if (requiredDataLoaded)
      return (
        <ChartPanelWrapper>
          {renderChartHeader()}
          <ChartWrapper>
            {requiredDataLoaded ? (
              <Line
                data={chartData}
                options={chartOptions}
                // width={1000}
                // height={250}
              />
            ) : (
              <React.Fragment />
            )}
          </ChartWrapper>
        </ChartPanelWrapper>
      );
    else if (!providerActive) {
      return(
        <ChartPanelWrapper>
          <div className="loader">
          <img alt="bolt" src={require("assets/images/bolt.svg")} />
            <br/> Connect to view Price Chart
          </div>
        </ChartPanelWrapper>
      )
    } else return(
      <ChartPanelWrapper>
        <div className="loader">
        <img alt="bolt" src={require("assets/images/bolt.svg")} />
          <br/> Loading chart..
        </div>
      </ChartPanelWrapper>
    )
});

export default BondingCurveChart;
