const VerificateurPositif = artifacts.require("VerificateurPositif");

contract("VerificateurPositif", () => {
  it("should return true for positive number", async () => {
    const instance = await VerificateurPositif.deployed();
    const result = await instance.estPositif(5);
    assert.isTrue(result);
  });

  it("should return false for negative number", async () => {
    const instance = await VerificateurPositif.deployed();
    const result = await instance.estPositif(-3);
    assert.isFalse(result);
  });
});
