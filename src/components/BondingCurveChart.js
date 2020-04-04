import React from 'react';
import styled from 'styled-components';
import { Line } from 'react-chartjs-2';
import { observer } from 'mobx-react';
import { useStores } from '../contexts/storesContext';
import { normalizeBalance } from '../utils/token';

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

const BondingCurveChart = observer(({}) => {
    const {
        root: {
            tradingStore,
            providerStore,
            tokenStore,
            configStore,
            datStore,
        },
    } = useStores();

    const staticParamsLoaded = datStore.areAllStaticParamsLoaded(
        configStore.activeDatAddress
    );
    const totalSupply = tokenStore.getTotalSupply(configStore.activeDatAddress);

    const requiredDataLoaded = staticParamsLoaded && !!totalSupply;

    let data, options;

    const generateChart = () => {
        const buySlope = datStore.getBuySlope(configStore.activeDatAddress);
        const initGoal = datStore.getInitGoal(configStore.activeDatAddress);
        const initReserve = datStore.getInitReserve(
            configStore.activeDatAddress
        );

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
                            callback: function (value, index, values) {
                                return value + ' ETH';
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

        const datasets = [];

        const initGoalNormalized = normalizeBalance(initGoal);
        const initGoalX = initGoalNormalized.toNumber();
        const initGoalY = initGoalNormalized.times(buySlope).toNumber();


        // Flat line for initial goal section
        if (initGoal.gt(0)) {
            datasets.push({
                label: 'Check out the data',
                fill: false,
                data: [
                    { x: 0, y: initGoalY },
                    { x: initGoalX, y: initGoalY },
                ],
                borderWidth: 2,
                pointRadius: 0,
                borderColor: '#5b76fa',
                lineTension: 0,
            });
        }

        // Sloped line for init goal -> totalSupply -> totalSupply x 5
        const totalSupplyWithoutPremint = totalSupply.minus(initReserve);

        const totalSupplyNormalized = normalizeBalance(
            totalSupplyWithoutPremint
        );

        const totalSupplyX = totalSupplyNormalized.toNumber();
        const totalSupplyY = totalSupplyNormalized.times(buySlope).toNumber();

        const futureX = normalizeBalance(totalSupply.times(5)).toNumber();
        const futureY = normalizeBalance(totalSupply.times(5))
            .times(buySlope)
            .toNumber();

        console.log({
            datParams: datStore.datParams[configStore.activeDatAddress],
            initReserve: initReserve.toString(),
            initGoal: initGoal.toString(),
            buySlope: buySlope.toString(),
            initGoalNormalized: initGoalNormalized.toString(),
            initGoalX,
            initGoalY,
            totalSupplyX,
            totalSupplyY,
            futureX,
            futureY
        });

        datasets.push({
            label: '',
            fill: false,
            data: [
                { x: initGoalNormalized, y: 1 },
                { x: totalSupplyX, y: totalSupplyY },
                { x: futureX, y: futureY },
            ],
            borderWidth: 2,
            pointRadius: 0,
            borderColor: 'gray',
        });

        // Add CIRCLE at totalSupply
        datasets.push({
            label: '',
            fill: false,
            data: [{ x: totalSupplyX, y: totalSupplyY }],
            pointRadius: 7,
            pointBackgroundColor: '#5b76fa',
            borderWidth: 1,
            pointBorderColor: '#5b76fa',
        });

        // Add CIRCLE at totalSupply +

        const data = {
            datasets,
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

    return (
        <ChartPanelWrapper>
            <ChartHeaderWrapper>
                <ChartBox>
                    <ChartHeaderFullElement>
                        <ChartHeaderTopElement>
                            Token Price
                        </ChartHeaderTopElement>
                        <ChartHeaderBottomElement>
                            1.25 DXD/DAI
                        </ChartHeaderBottomElement>
                    </ChartHeaderFullElement>
                </ChartBox>
                <ChartBox>
                    <ChartHeaderFullElement>
                        <ChartHeaderTopElement>24h price</ChartHeaderTopElement>
                        <ChartHeaderBottomElement className="green-text">
                            +10.51%
                        </ChartHeaderBottomElement>
                    </ChartHeaderFullElement>
                </ChartBox>
                <ChartBox>
                    <ChartHeaderFullElement>
                        <ChartHeaderTopElement>Minted</ChartHeaderTopElement>
                        <ChartHeaderBottomElement>
                            41.02 DXD
                        </ChartHeaderBottomElement>
                    </ChartHeaderFullElement>
                </ChartBox>
            </ChartHeaderWrapper>
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
