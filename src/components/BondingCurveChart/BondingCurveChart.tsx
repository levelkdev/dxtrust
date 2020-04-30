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
import COrgSim from '../../services/contractSimulators/cOrgSim';
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
    font-size: 18px;
    margin-top: 10px;
    font-weight: 500;
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

enum PointLabels {
    ZERO,
    KICKSTARTER_START,
    KICKSTARTER_END,
    CURRENT_SUPPLY,
    FUTURE_SUPPLY,
    CURVE_START,
    MAX_SUPPLY_TO_SHOW,
}

const chartGreen = '#54AE6F';
const chartBlue = '#5b76fa';
const chartGray = '#9FA8DA';
const gridLineColor = '#EAECF7';

const BondingCurveChart = observer(() => {
    const {
        root: { tradingStore, tokenStore, configStore, datStore },
    } = useStores();
<<<<<<< HEAD
    
    const activeDATAddress = configStore.getDXDTokenAddress()

=======
    const activeDATAddress = configStore.getDXDTokenAddress();
>>>>>>> 144fee40... fix bonding curve chart
    const staticParamsLoaded = datStore.areAllStaticParamsLoaded(
        activeDATAddress
    );
    const totalSupply = tokenStore.getTotalSupply(activeDATAddress);
    const datState = datStore.getState(activeDATAddress);
    const reserveBalance = datStore.getReserveBalance(
        activeDATAddress
    );

    const requiredDataLoaded =
        staticParamsLoaded &&
        !!totalSupply &&
        datState !== undefined &&
        !!reserveBalance;

    let buySlopeNum,
        buySlopeDen,
        initGoal,
        initReserve,
        cOrg,
        totalSupplyWithoutPremint,
        currentPrice,
        kickstarterPrice;

    if (requiredDataLoaded) {
        buySlopeNum = datStore.getBuySlopeNum(activeDATAddress);
        buySlopeDen = datStore.getBuySlopeDen(activeDATAddress);
        initGoal = datStore.getInitGoal(activeDATAddress);
        initReserve = datStore.getInitReserve(activeDATAddress);

        cOrg = new COrgSim({
            buySlopeNum,
            buySlopeDen,
            initGoal,
            initReserve,
            state: datState,
        });

        if (initGoal && initGoal.gt(0)) {
            kickstarterPrice = cOrg.getPriceAtSupply(initGoal.div(2));
        }

        totalSupplyWithoutPremint = totalSupply.minus(initReserve);
        currentPrice = cOrg.getPriceAtSupply(totalSupplyWithoutPremint);
    }

    let data, options;

    let points: ChartPointMap = {};

    const showTooltipForPoint = (pointId: PointLabels) => {
        return (
            pointId !== PointLabels.ZERO &&
            pointId !== PointLabels.KICKSTARTER_START &&
            pointId !== PointLabels.MAX_SUPPLY_TO_SHOW
        );
    };

    const getPointIdByCoordinates = (point: ChartPoint) => {
        if (point.x === points.zero.x && point.y === points.zero.y) {
            return PointLabels.ZERO;
        }

        if (
            point.x === points.maxSupplyToShow.x &&
            point.y === points.maxSupplyToShow.y
        ) {
            return PointLabels.MAX_SUPPLY_TO_SHOW;
        }

        if (
            point.x === points.kickStarterStart.x &&
            point.y === points.kickStarterStart.y
        ) {
            return PointLabels.KICKSTARTER_START;
        }

        if (
            point.x === points.kickstarterEnd.x &&
            point.y === points.kickstarterEnd.y
        ) {
            return PointLabels.KICKSTARTER_END;
        }

        if (
            point.x === points.curveStart.x &&
            point.y === points.curveStart.y
        ) {
            return PointLabels.CURVE_START;
        }

        if (
            point.x === points.currentSupply.x &&
            point.y === points.currentSupply.y
        ) {
            return PointLabels.CURRENT_SUPPLY;
        }

        if (
            point.x === points.futureSupply.x &&
            point.y === points.futureSupply.y
        ) {
            return PointLabels.FUTURE_SUPPLY;
        }
    };

    const generateLine = (
        chartData: ChartPoint[],
        color: string,
        label: string
    ) => {
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
                const pointId = getPointIdByCoordinates({
                    x: point.x,
                    y: point.y,
                });

                if (pointId === PointLabels.CURRENT_SUPPLY) {
                    return 4;
                } else {
                    return 2;
                }
            },
            borderColor: (context) => {
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
        points = {
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

        let maxSupplyToShow = denormalizeBalance(
            roundUpToScale(normalizeBalance(totalSupplyWithoutPremint.times(2)))
        );
        if (maxSupplyToShow.lt(initGoal.times(2))) {
            maxSupplyToShow = denormalizeBalance(
                roundUpToScale(
                    normalizeBalance(
                        totalSupplyWithoutPremint.plus(initGoal.times(2))
                    )
                )
            );
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
                const newMaxSupplyToShow = denormalizeBalance(
                    roundUpToScale(normalizeBalance(futureSupply.times(1.5)))
                );
                const newMaxPriceToShow = cOrg.getPriceAtSupply(
                    newMaxSupplyToShow
                );

                points.maxSupplyToShow = {
                    x: balanceToNumber(newMaxSupplyToShow),
                    y: valueToNumber(newMaxPriceToShow),
                };
            }
        }
        const datasets = [];

        const hasInitGoal = initGoal.gt(0);
        const hasExceededInitGoal = datStore.isRunPhase(
            activeDATAddress
        );

        console.debug('chartParams', {
            datParams: datStore.datParams[activeDATAddress],
            initReserve: initReserve.toString(),
            initGoal: initGoal.toString(),
            buySlopeNum: buySlopeNum.toString(),
            buySlopeDen: buySlopeDen.toString(),
            currentSupply: totalSupplyWithoutPremint.toString(),
            hasInitGoal,
            hasExceededInitGoal,
            points,
        });

        if (hasInitGoal && !hasExceededInitGoal) {
            datasets.push(
                generateLine(
                    [
                        points.kickStarterStart,
                        points.currentSupply,
                        points.kickstarterEnd,
                    ],
                    chartGreen,
                    'Kickstarter Funded'
                )
            );
        }

        if (hasExceededInitGoal) {
            datasets.push(
                generateLine(
                    [points.zero, points.currentSupply],
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

        const numLines = datasets.length;

        // datasets.push(
        //     generateSupplyMarker(
        //         points.currentSupply,
        //         PointLabels.CURRENT_SUPPLY,
        //         hasInitGoal && !hasExceededInitGoal ? chartGreen : chartBlue
        //     )
        // );

        // datasets.push(
        //     generateSupplyMarker(
        //         points.kickstarterEnd,
        //         PointLabels.KICKSTARTER_END,
        //         chartGreen
        //     )
        // );

        // datasets.push(
        //     generateSupplyMarker(
        //         points.curveStart,
        //         PointLabels.CURVE_START,
        //         chartBlue
        //     )
        // );

        if (hasActiveInput) {
            datasets.push(
                generateSupplyMarker(
                    points.futureSupply,
                    'Future Supply',
                    chartGray
                )
            );
        }

        data = {
            datasets,
            backgroundColor: '#000000',
        };

        options = {
            tooltips: {
                enabled: false,
                custom: pointTooltips,
                filter: (tooltipItem) => {
                    const pointId = getPointIdByCoordinates({
                        x: tooltipItem.xLabel,
                        y: tooltipItem.yLabel,
                    });

                    return showTooltipForPoint(pointId);
                },
                callbacks: {
                    // tslint:disable-next-line: no-shadowed-variable
                    label: (tooltipItem, data) => {
                        const pointId = getPointIdByCoordinates({
                            x: tooltipItem.xLabel,
                            y: tooltipItem.yLabel,
                        });

                        if (pointId === PointLabels.FUTURE_SUPPLY) {
                            return `DXD Issuance After Your Buy: ${tooltipItem.xLabel}`;
                        } else if (pointId === PointLabels.CURVE_START && tooltipItem.datasetIndex == 1) {
                            console.log("data index", tooltipItem.datasetIndex);
                            return 'After the kickstarter period, sales continue with an initial 2x increase in price';
                        }

                        if (tooltipItem.datasetIndex != 0) {
                            return false;
                        }

                        if (pointId === PointLabels.CURRENT_SUPPLY) {
                            const fundedText = requiredDataLoaded
                                ? `${formatBalance(reserveBalance)} ETH`
                                : '- ETH';
                            return `Currently ${fundedText} Funded`;
                        } else if (pointId === PointLabels.KICKSTARTER_END) {
                            const kickstarterGoalText = requiredDataLoaded
                                ? `${formatBalance(
                                      initGoal.times(kickstarterPrice)
                                  )} ETH`
                                : '- ETH';
                            return `Kickstarter ends when funding goal of ${kickstarterGoalText} reached`;
                        }

                        let toDisplay =
                            data.datasets[tooltipItem.datasetIndex].label || '';

                        if (toDisplay) {
                            toDisplay += ': ';
                        }
                        toDisplay += tooltipItem.yLabel + ' ETH / DXD';
                        return toDisplay;
                    },
                },
            },
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
                            color: gridLineColor,
                        },
                        position: 'right',
                        ticks: {
                            beginAtZero: true,
                            suggestedMax: points.maxSupplyToShow.y,
                            callback: (value, index, values) => {
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
        if (datStore.isInitPhase(activeDATAddress)) {
            return renderInitPhaseChartHeader();
        } else if (datStore.isRunPhase(activeDATAddress)) {
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
                                ? `${formatNumberValue(kickstarterPrice)} ETH`
                                : '- ETH'}
                        </ChartHeaderBottomElement>
                    </ChartHeaderFullElement>
                </ChartBox>
                <ChartBox>
                    <ChartHeaderFullElement>
                        <ChartHeaderTopElement>
                            DXD Supply
                        </ChartHeaderTopElement>
                        <ChartHeaderBottomElement>
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
                        <ChartHeaderBottomElement className="green-text">
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
                                      initGoal
                                  )} DXD`
                                : '- DXD'}
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
