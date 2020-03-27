import React from "react";
import styled from "styled-components";
import { keyframes,css } from "@emotion/core";
import MoonLoader from "react-spinners/MoonLoader";

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
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
			size: props.size
    };
  }

  render() {
    return (
      <Container>
        <MoonLoader
					css={loaderStyles}
          size={this.state.size}
          color={"#758AFE"}
          loading={this.state.loading}
        />
      </Container>
    );
  }
}

export default Loader;
