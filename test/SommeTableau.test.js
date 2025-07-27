const SommeTableau = artifacts.require("SommeTableau");

contract("SommeTableau", () => {
  it("should add and retrieve a number", async () => {
    const instance = await SommeTableau.deployed();
    await instance.ajouterNombre(100);
    const element = await instance.getElement(3);
    assert.equal(element.toString(), "100");
  });

  it("should calculate the correct sum", async () => {
    const instance = await SommeTableau.deployed();
    const sum = await instance.calculerSomme();
    assert.isAbove(Number(sum), 0);
  });
});
