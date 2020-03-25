import React from "react";
import styled from "styled-components";
import { keyframes,css } from "@emotion/core";
import MoonLoader from "react-spinners/MoonLoader";

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	margin 20px 0px;
`;

const LoaderText = styled.div`
	font-style: normal;
	font-weight: 500;
	font-size: 14px;
	line-height: 17px;
	color: rgba(83, 109, 254, 0.6);
	margin-top: 10px;
`;

const clip = keyframes`
	0% {transform: rotate(0deg) scale(1)}
	50% {transform: rotate(180deg) scale(1)}
	100% {transform: rotate(360deg) scale(1)}
`;

const loaderStyles = css`
	animation: ${clip} 1.25s 0s infinite linear !important;
`;

class Loader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
			message: props.message
    };
  }

  render() {
    return (
      <Container>
        <MoonLoader
					css={loaderStyles}
          size={48}
          color={"#758AFE"}
          loading={this.state.loading}
        />
				<LoaderText>{this.state.message}</LoaderText>
      </Container>
    );
  }
}

export default Loader;
