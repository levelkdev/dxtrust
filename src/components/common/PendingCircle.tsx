import React from 'react';
import styled from 'styled-components';

const SpinningCircle = styled.div`
    height:18px;
    width:18px;
    color: blue;
    top:50%;
    left:50%;
    margin: -(9px) 0 0 -(9px);
    -webkit-animation: rotation 1s infinite linear;
    -moz-animation: rotation 1s infinite linear;
    -o-animation: rotation 1s infinite linear;
    animation: rotation 1s infinite linear;
    border:3px solid #d4dcdf;
    border-radius:100%;

    :before {
        content:"";
        display:block;
        position:absolute;
        left:-3px;
        top: -3px;
        height:100%;
        width:100%;
        border-top:3px solid #758afe;
        border-left:3px solid #758afe;
        border-bottom:3px solid #758afe;
        border-right:3px solid transparent;
        border-radius:100%;
    }

    @-webkit-keyframes rotation {
       from {-webkit-transform: rotate(0deg);}
       to {-webkit-transform: rotate(359deg);}
    }
    @-moz-keyframes rotation {
       from {-moz-transform: rotate(0deg);}
       to {-moz-transform: rotate(359deg);}
    }
    @-o-keyframes rotation {
       from {-o-transform: rotate(0deg);}
       to {-o-transform: rotate(359deg);}
    }
    @keyframes rotation {
       from {transform: rotate(0deg);}
       to {transform: rotate(359deg);}
    }
`;

const PendingCircle = () => {
	return (
		<SpinningCircle />
	);
};

export default PendingCircle;