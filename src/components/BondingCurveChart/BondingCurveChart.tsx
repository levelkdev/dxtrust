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
    width: 610px;
    background-color: white;
    border: 1px solid var(--medium-gray);
    border-radius: 4px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    
    .loader {
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
`;

const ChartHeaderWrapper = styled.div`
    display: flex;
    padding: 15px;
    border-bottom: 1px solid var(--line-gray);
`;

const ChartBox = styled.div`
    display: flex;
    justify-content: center;
    width: calc(100% / 3);
`;

const ChartHeaderFullElement = styled.div`
    color: var(--dark-text-gray);
    padding: 10px 0px 10px 10px;
    width: 100%;
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
    color: ${(props) => props.isBuy ? '1px solid var(--line-gray)' : 'var(--red-text)'};
`

const ChartWrapper = styled.div`
    height: 250px;
    padding: 20px 20px 0px 20px;
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

const chartGreen = '#54AE6F';
const chartBlue = '#5b76fa';
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
    
    const providerActive = providerStore.getActiveWeb3React().active;

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

    const generateLine = (chartData: ChartPoint[], color: string, label: string) => {
        return {
          label,
          fill: true,
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
            chartBlue,
            'Kickstarter Price'
          )
        );
      }

      if (hasExceededInitGoal) {
        datasets.push(
          generateLine(
            [points.zero, points.currentBuyPrice, points.maxBuySupplyToShow],
            chartGreen,
            'Buy Price'
          )
        );
        
        datasets.push(
          generateLine(
            [points.zero, points.currentSellPrice,  points.maxSellSupplyToShow],
            chartBlue,
            'Sell Price'
          )
        );
        
      } else {
        datasets.push(
          generateLine(
            [points.kickstarterEnd, points.curveStart],
            chartGray,
            'Kickstarter Ends'
          )
        );
        
        datasets.push(
          generateLine(
            [points.curveStart, points.maxBuySupplyToShow],
            chartGreen,
            'Buy Price'
          )
        );

      }

      if (hasActiveInput) {
        datasets.push(
          generateSupplyMarker(
            points.futureSupply,
            'Future Supply',
            chartGreen
          )
        );
      }

      const buyData = {
        datasets,
        backgroundColor: '#000000',
      };

      const buyOptions = {
        tooltips: {
          enabled: false,
          custom: pointTooltips,
          filter: (tooltipItem, data) => {
            console.log(tooltipItem, data.datasets[tooltipItem.datasetIndex])
            return (
              data.datasets[tooltipItem.datasetIndex].label === "Buy Price"
              || data.datasets[tooltipItem.datasetIndex].label === "Sell Price"
              || (data.datasets[tooltipItem.datasetIndex].label === "Kickstarter Price" && tooltipItem.index > 0)
            );
          },
          callbacks: {
            // tslint:disable-next-line: no-shadowed-variable
            label: (tooltipItem, data) => {
              let toDisplay = data.datasets[tooltipItem.datasetIndex].label || '';

              if (toDisplay) { toDisplay += ': '; }
              toDisplay += tooltipItem.yLabel.toFixed(5) + ' ETH / DXD';
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

      return {
        buy: { data: buyData, options: buyOptions },
        sell: {  data: buyData, options: buyOptions }
      }
    };

    if (requiredDataLoaded) {
        const generated = generateChart();
        chartData = isBuy ? generated.buy.data : generated.sell.data;
        chartOptions = isBuy ? generated.buy.options : generated.sell.options;
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
          <ChartBox>
            <ChartHeaderFullElement>
              <ChartHeaderTopElement>{isBuy ? 'Buy Price' : 'Sell Price'}</ChartHeaderTopElement>
              <ChartHeaderBottomElement>
                {requiredDataLoaded ? `${formatNumberValue(kickstarterPrice)} ETH` : '- ETH'}
              </ChartHeaderBottomElement>
            </ChartHeaderFullElement>
          </ChartBox>
          <ChartBox>
            <ChartHeaderFullElement>
              <ChartHeaderTopElement>Invested</ChartHeaderTopElement>
              <ChartHeaderBottomElement className="green-text">
                {requiredDataLoaded ? `${formatBalance(totalSupplyWithoutPremint.times(kickstarterPrice), 18, 4, false)} ETH` : '- ETH'}
              </ChartHeaderBottomElement>
            </ChartHeaderFullElement>
          </ChartBox>
          <ChartBox>
            <ChartHeaderFullElement>
              <ChartHeaderTopElement>Goal</ChartHeaderTopElement>
              <ChartHeaderBottomElement>
                {requiredDataLoaded ? `${formatBalance( initGoal.times(kickstarterPrice) )} ETH` : '- ETH'}
              </ChartHeaderBottomElement>
            </ChartHeaderFullElement>
          </ChartBox>
          <ChartBox>
            <ChartHeaderFullElement>
              <ChartHeaderTopElement>
                Curve Issuance
              </ChartHeaderTopElement>
              <ChartHeaderBottomElement>
                {requiredDataLoaded ? `${formatBalance( totalSupplyWithoutPremint )} DXD` : '- DXD'}
              </ChartHeaderBottomElement>
            </ChartHeaderFullElement>
          </ChartBox>
        </ChartHeaderWrapper>
      );
    };

    const renderRunPhaseChartHeader = () => {
      return (
        <ChartHeaderWrapper>
          <ChartBox>
            <ChartHeaderFullElement>
              <ChartHeaderTopElement>{isBuy ? 'Buy Price' : 'Sell Price'}</ChartHeaderTopElement>
              {isBuy
                ? <PriceBottomElement isBuy={isBuy} >
                  {requiredDataLoaded ? `${formatNumberValue(currentBuyPrice)} ETH` : '- DXD/ETH' }
                </PriceBottomElement>
                : <PriceBottomElement isBuy={isBuy} >
                  {requiredDataLoaded ? `${formatNumberValue(currentSellPrice)} ETH` : '- DXD/ETH' }
                </PriceBottomElement>
              }
            </ChartHeaderFullElement>
          </ChartBox>
          <ChartBox>
            <ChartHeaderFullElement>
              <ChartHeaderTopElement>Reserve</ChartHeaderTopElement>
              <ChartHeaderBottomElement>
                {requiredDataLoaded ? `${formatBalance(reserveBalance)} ETH` : '- ETH'}
              </ChartHeaderBottomElement>
            </ChartHeaderFullElement>
          </ChartBox>
          <ChartBox>
              <ChartHeaderFullElement>
                <ChartHeaderTopElement>
                  Curve Issuance
                </ChartHeaderTopElement>
                <ChartHeaderBottomElement className="green-text">
                  {requiredDataLoaded ? `${formatBalance( totalSupplyWithoutPremint )} DXD` : '- DXD'}
                </ChartHeaderBottomElement>
              </ChartHeaderFullElement>
          </ChartBox>
          <ChartBox>
            <ChartHeaderFullElement>
              <ChartHeaderTopElement>Total Supply</ChartHeaderTopElement>
              <ChartHeaderBottomElement>
                {requiredDataLoaded ? `${formatBalance(totalSupplyWithPremint)} DXD` : '- DXD'}
              </ChartHeaderBottomElement>
            </ChartHeaderFullElement>
          </ChartBox>
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
