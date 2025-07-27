const VerificateurPositif = artifacts.require("VerificateurPositif");

module.exports = function (deployer) {
  deployer.deploy(VerificateurPositif);
};
