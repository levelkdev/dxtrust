import React from 'react'
import styled from 'styled-components'
import Form from '../common/Form'

const SellForm = ({count, setCount}) => {
  return (
    <Form buttontext="Sell DXD" infotext="Receive" count={count} setCount={setCount} />
  )
}

export default SellForm
