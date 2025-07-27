// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AdditionContract {
    uint public a = 5;
    uint public b = 3;

    function addition1() public view returns (uint) {
        return a + b;
    }

    function addition2(uint x, uint y) public pure returns (uint) {
        return x + y;
    }
}
