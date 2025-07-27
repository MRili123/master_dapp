const Rectangle = artifacts.require("Rectangle");

module.exports = function (deployer) {
  // Sample initial values: x=0, y=0, longueur=5, largeur=10
  deployer.deploy(Rectangle, 0, 0, 5, 10);
};
