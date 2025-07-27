const Payment = artifacts.require("Payment");

module.exports = function (deployer, network, accounts) {
  const recipient = accounts[0]; // First account provided by Ganache
  deployer.deploy(Payment, recipient);
};
