// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SommeTableau {
    uint[] public nombres;

    constructor() {
        nombres.push(1);
        nombres.push(2);
        nombres.push(3);
    }

    function ajouterNombre(uint nombre) public {
        nombres.push(nombre);
    }

    function getElement(uint index) public view returns (uint) {
        require(index < nombres.length, "Index hors limites");
        return nombres[index];
    }

    function afficheTableau() public view returns (uint[] memory) {
        return nombres;
    }

    function calculerSomme() public view returns (uint somme) {
        for (uint i = 0; i < nombres.length; i++) {
            somme += nombres[i];
        }
    }
}