const VerificateurParite = artifacts.require("VerificateurParite");

module.exports = function (deployer) {
  deployer.deploy(VerificateurParite);
};
