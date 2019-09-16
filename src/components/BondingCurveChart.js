import React from 'react'
import styled from 'styled-components'
import { Line } from 'react-chartjs-2'

const ChartWrapper = styled.div`
  width: 65%;
  padding: 20px;
  background-color: white;
  border: 2px solid var(--medium-gray);
  border-radius: 4px;
`

const ChartHeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
`

const ChartHeaderFullElement = styled.div`
  padding: 10px;
`

const ChartHeaderTopElement = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: var(--dark-gray);
`

const ChartHeaderBottomElement = styled.div`
  font-size: 17px;
  margin-top: 10px;
`

const BondingCurveChart = ({}) => {

  const options = {
    maintainAspectRatio: false,
    legend: {
      display: false
    },
    scales: {
      xAxes: [{
        type: 'linear',
        display: true,
        gridLines: {
          display: false,
        },
        scaleLabel: {
          display: true,
          labelString: ''
        },
        ticks: {
          major: {
            fontStyle: 'bold',
            fontColor: '#FF0000'
          }
        }
      }],
      yAxes: [{
        display: true,
        position: 'right',
        ticks: {
          callback: function(value, index, values) {
            return value + " DAI";
          }
        },
        scaleLabel: {
          display: true,
          labelString: ''
        }
      }]
    }
  }

  const data = {
    datasets: [{
      label: 'Check out the data',
      fill: false,
      data: [ {x: 1, y: 1}, {x: 2, y: 2}, {x: 3, y: 4}, {x: 4, y: 7}],
      borderWidth: 2,
      pointRadius: 0,
      borderColor: "#5b76fa",
    }, {
     label: '',
     fill: false,
     data: [ {x: 4, y: 7}, {x: 5, y: 11}, {x: 6, y: 16}, {x: 7, y: 22} ],
     borderWidth: 2,
     pointRadius: 0,
     borderColor: "gray"
    }, {
     label: '',
     fill: false,
     data: [ {x: 4, y: 7} ],
     pointRadius: 7,
     pointBackgroundColor: "#5b76fa",
     borderWidth: 1,
     pointBorderColor: "#5b76fa"
    }
    ]
  }
 
  return (
    <ChartWrapper>
      <ChartHeaderWrapper>
        <ChartHeaderFullElement>
          <ChartHeaderTopElement>Token Price</ChartHeaderTopElement>
          <ChartHeaderBottomElement>1.25 DXD/DAI</ChartHeaderBottomElement>
        </ChartHeaderFullElement>
        <ChartHeaderFullElement>
          <ChartHeaderTopElement>24h price</ChartHeaderTopElement>
          <ChartHeaderBottomElement className="green-text">+10.51%</ChartHeaderBottomElement>
        </ChartHeaderFullElement>
        <ChartHeaderFullElement>
          <ChartHeaderTopElement>Minted</ChartHeaderTopElement>
          <ChartHeaderBottomElement>41.02 DXD</ChartHeaderBottomElement>
        </ChartHeaderFullElement>
      </ChartHeaderWrapper>
      <Line
        data={data}
        options={options}
        // width={1000}
        height={200} />
    </ChartWrapper>
  )
}

export default BondingCurveChart
