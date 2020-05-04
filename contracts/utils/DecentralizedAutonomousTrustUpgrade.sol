pragma solidity 0.5.17;

import "../DecentralizedAutonomousTrust.sol";

contract DecentralizedAutonomousTrustUpgrade
  is DecentralizedAutonomousTrust
{
    
    uint256 public newNumber;

    function saveNumber(uint _newNumber) public {
      require(control == msg.sender);
      newNumber = _newNumber;
    }
  
}
