// Token Scale -> Wei Scale
import { BigNumber } from './bignumber';
import { bnum, DEFAULT_TOKEN_DECIMALS, scale } from './helpers';

export const denormalizeBalance = (
    amount: BigNumber,
    tokenAddress: string,
    decimals: number = DEFAULT_TOKEN_DECIMALS
): BigNumber => {
    return scale(bnum(amount), decimals);
};

// Wei Scale -> Token Scale
export const normalizeBalance = (
    amount: BigNumber,
    tokenAddress: string,
    decimals: number = DEFAULT_TOKEN_DECIMALS
): BigNumber => {
    return scale(bnum(amount), decimals);
};

export const formatBalanceTruncated = (
    balance: BigNumber,
    decimals: number,
    precision: number,
    truncateAt: number
): string => {
    const result = formatBalance(balance, decimals, precision);
    if (result.length > truncateAt) {
        return result.substring(0, 20) + '...';
    } else {
        return result;
    }
};

export const formatNormalizedTokenValue = (
    normalizedBalance: BigNumber,
    displayPrecision: number,
    truncateAt?: number
): string => {
    if (normalizedBalance.eq(0)) {
        return bnum(0).toFixed(2);
    }

    let result = bnum(normalizedBalance)
        .decimalPlaces(displayPrecision, BigNumber.ROUND_DOWN)
        .toString();

    result = padToDecimalPlaces(result, 2);

    if (truncateAt && result.length > truncateAt) {
        return result.substring(0, 20) + '...';
    } else {
        return result;
    }
};

export const formatBalance = (
    balance: BigNumber,
    decimals: number,
    precision: number
): string => {
    if (balance.eq(0)) {
        return bnum(0).toFixed(2);
    }

    const result = scale(balance, -decimals)
        .decimalPlaces(precision, BigNumber.ROUND_DOWN)
        .toString();

    return padToDecimalPlaces(result, 2);
};

export const padToDecimalPlaces = (
    value: string,
    minDecimals: number
): string => {
    const split = value.split('.');
    const zerosToPad = split[1] ? minDecimals - split[1].length : minDecimals;

    if (zerosToPad > 0) {
        let pad = '';

        // Add decimal point if no decimal portion in original number
        if (zerosToPad === minDecimals) {
            pad += '.';
        }
        for (let i = 0; i < zerosToPad; i++) {
            pad += '0';
        }
        return value + pad;
    }
    return value;
};
