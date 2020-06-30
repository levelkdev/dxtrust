import fetch from 'isomorphic-fetch';
import { TokenInfo, Holder } from '../types';

const ETHPLORER_API_URL =
    process.env.REACT_APP_ETHPLORER_API_URL || 'https://api.ethplorer.io';
const ETHPLORER_API_KEY = process.env.REACT_APP_ETHPLORER_API_KEY;
const DXDAO_ADDRESS = '0xa1d65E8fB6e87b60FECCBc582F7f97804B725521';

export async function getTokenInfo(): Promise<TokenInfo> {
    const query = `apiKey=${ETHPLORER_API_KEY}`;
    const response = await fetch(
        `${ETHPLORER_API_URL}/getTokenInfo/${DXDAO_ADDRESS}/?${query}`,
        {
            headers: {},
        }
    );

    const tokenInfo = await response.json();

    return tokenInfo;
}

export async function getTopTokenHolders(limit: number): Promise<Holder[]> {
    const query = `apiKey=${ETHPLORER_API_KEY}&limit=${limit}`;
    const response = await fetch(
        `${ETHPLORER_API_URL}/getTopTokenHolders/${DXDAO_ADDRESS}/?${query}`,
        {
            headers: {},
        }
    );

    const tokenHolders = (await response.json()).holders;
    return tokenHolders;
}
