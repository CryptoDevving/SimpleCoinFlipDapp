pragma solidity 0.5.12;

import "./SafeMath.sol";

contract SimpleCoinFlip {

    event FlipOutcome(bool didWin, uint winning, string uuid, address gambler);

    function random() private view returns (uint) {
        return block.timestamp % 2;
    }

    function getCurrentJackpot() public view returns (uint) {
        return SafeMath.div(address(this).balance, 4);
    }

    function bet(string memory uuid) public payable returns (bool) {
        require(msg.sender.balance >= msg.value, "Sender must have a balance greater than or equal to their bet.");
        require(msg.sender.balance >= getCurrentJackpot(), "Sender's bet cannot exceed jackpot");

        if (random() == 0) {
            // Win
            uint winning = msg.value + getCurrentJackpot();
            msg.sender.transfer(winning);
            emit FlipOutcome(true, winning, uuid, msg.sender);
            return true;
        } else {
            emit FlipOutcome(false, 0, uuid, msg.sender);
            return false;
        }
    }

    function () external payable {}
}
