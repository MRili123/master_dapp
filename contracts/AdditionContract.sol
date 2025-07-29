// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AdditionContract {
    event AdditionDone(uint x, uint y, uint result);

    function addition2(uint x, uint y) public returns (uint) {
        uint res = x + y;
        emit AdditionDone(x, y, res);
        return res;
    }
}
