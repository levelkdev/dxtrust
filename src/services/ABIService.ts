interface AbiMap {
    [index: string]: object;
}

export const schema = {
    ERC20: require('../contracts/ERC20').abi,
    BondedToken: require('../contracts/ERC20').abi,
    BondingCurve: require('../contracts/ERC20').abi,
    BondingCurveEther: require('../contracts/ERC20').abi,
    RewardsDistributor: require('../contracts/ERC20').abi,
    StaticCurveLogic: require('../contracts/ERC20').abi,
    DecentralizedAutonomousTrust: require('../contracts/DecentralizedAutonomousTrust')
        .abi,
    Multicall: require('../contracts/Multicall')
    .abi,
};

export default class ABIService {
    abiMap: AbiMap;

    getAbi(contractType: string) {
        return schema[contractType];
    }
}
