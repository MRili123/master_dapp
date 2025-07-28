// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VerificateurPositif {
    int public lastChecked;

    function estPositif(int nombre) public pure returns (bool) {
        return nombre >= 0;
    }

    function checkAndStore(int nombre) public {
        lastChecked = nombre;
    }
}