const VerificateurParite = artifacts.require("VerificateurParite");

contract("VerificateurParite", () => {
  it("should return true for even number", async () => {
    const instance = await VerificateurParite.deployed();
    const result = await instance.estPair(6);
    assert.isTrue(result);
  });

  it("should return false for odd number", async () => {
    const instance = await VerificateurParite.deployed();
    const result = await instance.estPair(5);
    assert.isFalse(result);
  });
});
