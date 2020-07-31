pragma solidity 0.5.12;

import "./SafeMath.sol";

contract SimpleCoinFlip {

    function random() public view returns (uint) {
        return block.timestamp % 2;
    }

    function getPotentialWinnings() public view returns (uint) {
        return SafeMath.div(address(this).balance, 2);
    }

    function () external payable {}
}
