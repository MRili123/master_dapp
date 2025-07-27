const Convertisseur = artifacts.require("Convertisseur");

contract("Convertisseur", (accounts) => {
  it("should convert 1 Ether to Wei", async () => {
    const instance = await Convertisseur.deployed();
    const result = await instance.etherEnWei(1);
    assert.equal(result.toString(), web3.utils.toWei("1", "ether"), "Conversion is incorrect");
  });

  it("should convert 1e18 Wei to 1 Ether", async () => {
    const instance = await Convertisseur.deployed();
    const result = await instance.weiEnEther(web3.utils.toWei("1", "ether"));
    assert.equal(result.toString(), "1", "Inverse conversion is incorrect");
  });
});
