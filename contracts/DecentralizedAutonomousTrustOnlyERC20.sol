pragma solidity 0.5.17;

import "./DecentralizedAutonomousTrust.sol";

/**
 * @title DecentralizedAutonomousTrustOnlyERC20
 */
contract DecentralizedAutonomousTrustOnlyERC20 is DecentralizedAutonomousTrust {
  
  function recover(address _token) public {
    if (_token == address(0))
      beneficiary.transfer(address(this).balance);
    else
      IERC20(_token).transfer(beneficiary, IERC20(_token).balanceOf(address(this)));
  }
  
  function transferBeneficiary(address payable newBeneficiary) public {
    require(msg.sender == beneficiary, "CONTROL_ONLY");
    beneficiary = newBeneficiary;
  }
  
  function estimateBuyValue(
    uint _currencyValue
  ) public view
    returns (uint)
  {
    revert("DecentralizedAutonomousTrustOnlyERC20: Old DAT function not allowed anymore. Only ERC20 functions allowed now");
  }
  
  function buy(
    address _to,
    uint _currencyValue,
    uint _minTokensBought
  ) public payable
  {
    revert("DecentralizedAutonomousTrustOnlyERC20: Old DAT function not allowed anymore. Only ERC20 functions allowed now");
  }
  
  function estimateSellValue(
    uint _quantityToSell
  ) public view
    returns(uint)
  {
    revert("DecentralizedAutonomousTrustOnlyERC20: Old DAT function not allowed anymore. Only ERC20 functions allowed now");
  }
  
  function sell(
    address payable _to,
    uint _quantityToSell,
    uint _minCurrencyReturned
  ) public
  {
    revert("DecentralizedAutonomousTrustOnlyERC20: Old DAT function not allowed anymore. Only ERC20 functions allowed now");
  }
  
  function estimatePayValue(
    uint _currencyValue
  ) public view
    returns (uint)
  {
    revert("DecentralizedAutonomousTrustOnlyERC20: Old DAT function not allowed anymore. Only ERC20 functions allowed now");
  }
  
  function pay(
    address _to,
    uint _currencyValue
  ) public payable
  {
    revert("DecentralizedAutonomousTrustOnlyERC20: Old DAT function not allowed anymore. Only ERC20 functions allowed now");
  }
  
  function estimateExitFee(
    uint _msgValue
  ) public view
    returns(uint)
  {
    revert("DecentralizedAutonomousTrustOnlyERC20: Old DAT function not allowed anymore. Only ERC20 functions allowed now");
  }
  
  function close() public payable
  {
    revert("DecentralizedAutonomousTrustOnlyERC20: Old DAT function not allowed anymore. Only ERC20 functions allowed now");
  }
  
}
