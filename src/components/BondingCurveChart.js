import React from 'react'
import styled from 'styled-components'
import { Line } from 'react-chartjs-2'

const ChartWrapper = styled.div`
  width: 500px;
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
      <Line
        data={data}
        options={options}
        // width={1000}
        height={400} />
    </ChartWrapper>
  )
}

export default BondingCurveChart
