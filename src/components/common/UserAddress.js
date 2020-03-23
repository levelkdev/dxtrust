import React from 'react'
import styled from 'styled-components'

const AddressPill = styled.div`
	height: 40px;
	width: 166px;
	display: flex;
	justify-content: center;
	align-items: center;

	background: #FFFFFF;
	border: 1px solid #E1E3E7;
	box-sizing: border-box;
	box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.15);
	border-radius: 6px;

	font-family: var(--roboto);
	font-size: 14px;
	line-height: 17px;
	letter-spacing: 0.2px;
	color: var(--dark-text-gray);
`


const UserAddress = ({address}) => {

	function toAddressStub(address) {
	  const start = address.slice(0, 5)
	  const end = address.slice(-3)

	  return `${start}...${end}`
	}

	return (
		<AddressPill>
			{toAddressStub(address)}
		</AddressPill>
	)
}

export default UserAddress