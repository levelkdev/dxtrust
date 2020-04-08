import React from 'react';
import styled from 'styled-components';
import { Line } from 'react-chartjs-2';
import { observer } from 'mobx-react';
import { useStores } from '../contexts/storesContext';
import {
    denormalizeBalance,
    formatBalance,
    formatNumberValue,
    normalizeBalance,
} from '../utils/token';
import COrgSim from '../services/contractSimulators/cOrgSim';
import { BigNumber } from '../utils/bignumber';
import { validateTokenValue, ValidationStatus } from '../utils/validators';
import { bnum } from '../utils/helpers';
import { DatState } from '../stores/datStore';
import { roundUpToScale } from '../utils/number';

const ChartPanelWrapper = styled.div`
    width: 610px;
    background-color: white;
    border: 1px solid var(--medium-gray);
    border-radius: 4px;
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
    padding: 10px;
`;

const ChartHeaderTopElement = styled.div`
    font-size: 14px;
    font-weight: 500;
    color: var(--light-text-gray);
`;

const ChartHeaderBottomElement = styled.div`
    font-size: 17px;
    margin-top: 10px;
`;

const ChartWrapper = styled.div`
    height: 250px;
    padding: 20px 20px 0px 20px;
`;

interface ChartPointMap {
    [index: string]: ChartPoint;
}

interface ChartPoint {
    x: number;
    y: number;
}

const chartGreen = 'green';
const chartBlue = '#5b76fa';
const chartGray = 'gray';

const BondingCurveChart = observer(({}) => {
    const {
        root: { tradingStore, tokenStore, configStore, datStore },
    } = useStores();

    const staticParamsLoaded = datStore.areAllStaticParamsLoaded(
        configStore.activeDatAddress
    );
    const totalSupply = tokenStore.getTotalSupply(configStore.activeDatAddress);
    const datState = datStore.getState(configStore.activeDatAddress);
    const reserveBalance = datStore.getReserveBalance(
        configStore.activeDatAddress
    );

    const requiredDataLoaded =
        staticParamsLoaded && !!totalSupply && !!datState && !!reserveBalance;

    let buySlopeNum,
        buySlopeDen,
        initGoal,
        initReserve,
        cOrg,
        totalSupplyWithoutPremint,
        currentPrice,
        kickstarterPrice;

    if (requiredDataLoaded) {
        buySlopeNum = datStore.getBuySlopeNum(configStore.activeDatAddress);
        buySlopeDen = datStore.getBuySlopeDen(configStore.activeDatAddress);
        initGoal = datStore.getInitGoal(configStore.activeDatAddress);
        initReserve = datStore.getInitReserve(configStore.activeDatAddress);

        cOrg = new COrgSim({
            buySlopeNum,
            buySlopeDen,
            initGoal,
            initReserve,
        });

        if (initGoal && initGoal.gt(0)) {
            kickstarterPrice = cOrg.getPriceAtSupply(initGoal.div(2));
        }

        totalSupplyWithoutPremint = totalSupply.minus(initReserve);
        currentPrice = cOrg.getPriceAtSupply(totalSupplyWithoutPremint);
    }

    let data, options;

    const generateLine = (data: ChartPoint[], color: string, label: string) => {
        return {
            label: label,
            fill: true,
            data: data,
            borderWidth: 2,
            pointRadius: 0,
            borderColor: color,
            lineTension: 0,
        };
    };

    const generateSupplyMarker = (point: ChartPoint, label: string) => {
        return {
            label: label,
            fill: false,
            data: [point],
            pointRadius: 7,
            pointBackgroundColor: chartBlue,
            borderWidth: 1,
            pointBorderColor: chartBlue,
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
        const points: ChartPointMap = {
            zero: {
                x: 0,
                y: 0,
            },
            currentSupply: {
                x: balanceToNumber(totalSupplyWithoutPremint),
                y: valueToNumber(currentPrice),
            },
        };

        if (initGoal.gt(0)) {
            points.kickStarterStart = {
                x: 0,
                y: valueToNumber(kickstarterPrice),
            };

            points.kickstarterEnd = {
                x: balanceToNumber(initGoal),
                y: valueToNumber(kickstarterPrice),
            };

            points.curveStart = {
                x: balanceToNumber(initGoal),
                y: valueToNumber(kickstarterPrice.times(2)),
            };
        }

        let maxSupplyToShow = denormalizeBalance(roundUpToScale(
            normalizeBalance(totalSupplyWithoutPremint.times(2))
        ));
        if (maxSupplyToShow.lt(initGoal.times(2))) {
            maxSupplyToShow = denormalizeBalance(roundUpToScale(
                normalizeBalance(
                    totalSupplyWithoutPremint.plus(initGoal.times(2))
                )));
        }
        const maxPriceToShow = cOrg.getPriceAtSupply(maxSupplyToShow);

        points.maxSupplyToShow = {
            x: balanceToNumber(maxSupplyToShow),
            y: valueToNumber(maxPriceToShow),
        };

        let supplyIncrease,
            futureSupply,
            futurePrice = bnum(0);
        let hasActiveInput = false;

        if (
            validateTokenValue(tradingStore.buyAmount) ===
            ValidationStatus.VALID
        ) {
            supplyIncrease = tradingStore.payAmount;
            futureSupply = totalSupplyWithoutPremint.plus(supplyIncrease);
            futurePrice = cOrg.getPriceAtSupply(futureSupply);
            points['futureSupply'] = {
                x: balanceToNumber(futureSupply),
                y: valueToNumber(futurePrice),
            };

            hasActiveInput = true;

            if (futureSupply.gte(maxSupplyToShow)) {
                const maxSupplyToShow = denormalizeBalance(roundUpToScale(
                    normalizeBalance(futureSupply.times(1.5))));
                const maxPriceToShow = cOrg.getPriceAtSupply(maxSupplyToShow);

                points.maxSupplyToShow = {
                    x: balanceToNumber(maxSupplyToShow),
                    y: valueToNumber(maxPriceToShow),
                };
            }
        }
        const datasets = [];

        const hasInitGoal = initGoal.gt(0);
        const hasExceededInitGoal = datStore.isRunPhase(
            configStore.activeDatAddress
        );
        const futureSupplyExceedsInitGoal =
            hasActiveInput && futureSupply.gt(initGoal);

        console.debug('chartParams', {
            datParams: datStore.datParams[configStore.activeDatAddress],
            initReserve: initReserve.toString(),
            initGoal: initGoal.toString(),
            buySlopeNum: buySlopeNum.toString(),
            buySlopeDen: buySlopeDen.toString(),
            currentSupply: totalSupplyWithoutPremint.toString(),
            hasInitGoal: hasInitGoal,
            hasExceededInitGoal: hasExceededInitGoal,
            points: points,
        });

        if (hasInitGoal && !hasExceededInitGoal) {
            datasets.push(
                generateLine(
                    [points.currentSupply, points.kickstarterEnd],
                    chartGreen,
                    'Kickstarter Funded'
                )
            );

            datasets.push(
                generateLine(
                    [points.kickStarterStart, points.currentSupply],
                    chartBlue,
                    'Kickstarter Unfunded'
                )
            );
        }

        if (hasExceededInitGoal) {
            datasets.push(
                generateLine(
                    [points.zero, points.curveStart, points.currentSupply],
                    chartBlue,
                    'Curve chart funded'
                )
            );

            datasets.push(
                generateLine(
                    [points.currentSupply, points.maxSupplyToShow],
                    chartGray,
                    'Curve chart unfunded'
                )
            );
        } else {
            datasets.push(
                generateLine(
                    [points.kickstarterEnd, points.curveStart],
                    chartGray,
                    'Curve chart point of change'
                )
            );

            datasets.push(
                generateLine(
                    [points.curveStart, points.maxSupplyToShow],
                    chartGray,
                    'Curve chart funded'
                )
            );
        }

        datasets.push(
            generateSupplyMarker(points.currentSupply, 'Current Supply')
        );

        if (hasActiveInput) {
            datasets.push(
                generateSupplyMarker(points.futureSupply, 'Future Supply')
            );
        }

        const data = {
            datasets,
        };

        const options = {
            maintainAspectRatio: false,
            legend: {
                display: false,
            },
            scales: {
                xAxes: [
                    {
                        type: 'linear',
                        display: true,
                        gridLines: {
                            display: false,
                        },
                        scaleLabel: {
                            display: true,
                            labelString: '',
                        },
                        ticks: {
                            beginAtZero: true,
                            max: points.maxSupplyToShow.x,
                            major: {
                                fontStyle: 'bold',
                                fontColor: '#BDBDBD',
                            },
                        },
                    },
                ],
                yAxes: [
                    {
                        display: true,
                        gridLines: {
                            display: true,
                            color: '#E1E3E7',
                        },
                        position: 'right',
                        ticks: {
                            beginAtZero: true,
                            suggestedMax: points.maxSupplyToShow.y,
                            callback: function (value, index, values) {
                                return (
                                    formatNumberValue(bnum(value), 2) + ' ETH'
                                );
                            },
                        },
                        scaleLabel: {
                            display: true,
                            labelString: '',
                        },
                    },
                ],
            },
        };

        return {
            data,
            options,
        };
    };

    if (requiredDataLoaded) {
        const generated = generateChart();
        data = generated.data;
        options = generated.options;
    }

    /*
        Draw a strait line for the inital goal. The PRICE for this is the slope for total supply 0
        We may have to hardcode this value...

        It's a slope but I DON"T understand because it's 1 / 10^18!!!! And it seems to be about 1/3 of tokens.
     */

    const renderChartHeader = () => {
        if (datStore.isInitPhase(configStore.activeDatAddress)) {
            return renderInitPhaseChartHeader();
        } else if (datStore.isRunPhase(configStore.activeDatAddress)) {
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
                        <ChartHeaderTopElement>Price</ChartHeaderTopElement>
                        <ChartHeaderBottomElement>
                            {requiredDataLoaded
                                ? `${formatNumberValue(
                                      kickstarterPrice
                                  )} DXD/ETH`
                                : '- DXD/ETH'}
                        </ChartHeaderBottomElement>
                    </ChartHeaderFullElement>
                </ChartBox>
                <ChartBox>
                    <ChartHeaderFullElement>
                        <ChartHeaderTopElement>
                            DXD Supply
                        </ChartHeaderTopElement>
                        <ChartHeaderBottomElement className="green-text">
                            {requiredDataLoaded
                                ? `${formatBalance(
                                      totalSupplyWithoutPremint
                                  )} DXD`
                                : '- DXD'}
                        </ChartHeaderBottomElement>
                    </ChartHeaderFullElement>
                </ChartBox>
                <ChartBox>
                    <ChartHeaderFullElement>
                        <ChartHeaderTopElement>Invested</ChartHeaderTopElement>
                        <ChartHeaderBottomElement>
                            {requiredDataLoaded
                                ? `${formatBalance(reserveBalance)} ETH`
                                : '- ETH'}
                        </ChartHeaderBottomElement>
                    </ChartHeaderFullElement>
                </ChartBox>
                <ChartBox>
                    <ChartHeaderFullElement>
                        <ChartHeaderTopElement>Goal</ChartHeaderTopElement>
                        <ChartHeaderBottomElement>
                            {requiredDataLoaded
                                ? `${formatBalance(
                                      initGoal.times(kickstarterPrice)
                                  )} ETH`
                                : '- ETH'}
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
                        <ChartHeaderTopElement>Price</ChartHeaderTopElement>
                        <ChartHeaderBottomElement>
                            {requiredDataLoaded
                                ? `${formatNumberValue(currentPrice)} DXD/ETH`
                                : '- DXD/ETH'}
                        </ChartHeaderBottomElement>
                    </ChartHeaderFullElement>
                </ChartBox>
                <ChartBox>
                    <ChartHeaderFullElement>
                        <ChartHeaderTopElement>
                            DXD Supply
                        </ChartHeaderTopElement>
                        <ChartHeaderBottomElement className="green-text">
                            {requiredDataLoaded
                                ? `${formatBalance(
                                      totalSupplyWithoutPremint
                                  )} DXD`
                                : '- DXD'}
                        </ChartHeaderBottomElement>
                    </ChartHeaderFullElement>
                </ChartBox>
                <ChartBox>
                    <ChartHeaderFullElement>
                        <ChartHeaderTopElement>Reserve</ChartHeaderTopElement>
                        <ChartHeaderBottomElement>
                            {requiredDataLoaded
                                ? `${formatBalance(reserveBalance)} ETH`
                                : '- ETH'}
                        </ChartHeaderBottomElement>
                    </ChartHeaderFullElement>
                </ChartBox>
            </ChartHeaderWrapper>
        );
    };

    return (
        <ChartPanelWrapper>
            {renderChartHeader()}
            <ChartWrapper>
                {requiredDataLoaded ? (
                    <Line
                        data={data}
                        options={options}
                        // width={1000}
                        // height={250}
                    />
                ) : (
                    <React.Fragment />
                )}
            </ChartWrapper>
        </ChartPanelWrapper>
    );
});

export default BondingCurveChart;
