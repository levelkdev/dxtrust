pragma solidity ^0.5.0;

import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/ERC20Mintable.sol";
import "@openzeppelin/upgrades/contracts/upgradeability/AdminUpgradeabilityProxy.sol";
import "@openzeppelin/upgrades/contracts/upgradeability/ProxyAdmin.sol";

/**
 * This creates the artifacts allowing us to use these 3rd party contracts directly
 */
contract Dependencies is ERC20Mintable, AdminUpgradeabilityProxy, ProxyAdmin
{
  constructor() internal
    ERC20Mintable()
    AdminUpgradeabilityProxy(address(0), address(0), "")
  {}
}
