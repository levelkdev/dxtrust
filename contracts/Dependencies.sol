pragma solidity ^0.5.0;

import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/ERC20Mintable.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/drafts/TokenVesting.sol";
import "@openzeppelin/upgrades/contracts/upgradeability/AdminUpgradeabilityProxy.sol";
import "@openzeppelin/upgrades/contracts/upgradeability/ProxyAdmin.sol";

/**
 * This creates the artifacts allowing us to use these 3rd party contracts directly
 */
contract Dependencies
{
  constructor() internal {}
}
