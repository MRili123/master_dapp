// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VerificateurParite {
    function estPair(uint nombre) public pure returns (bool) {
        return nombre % 2 == 0;
    }
}
