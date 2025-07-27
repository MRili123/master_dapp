const GestionChaines = artifacts.require("GestionChaines");

contract("GestionChaines", () => {
  it("should set and get message", async () => {
    const instance = await GestionChaines.deployed();
    await instance.setMessage("Hello");
    const msg = await instance.getMessage();
    assert.equal(msg, "Hello");
  });

  it("should concatenate two strings", async () => {
    const instance = await GestionChaines.deployed();
    const result = await instance.concatener("Web", "3");
    assert.equal(result, "Web3");
  });

  it("should compare two equal strings", async () => {
    const instance = await GestionChaines.deployed();
    const isEqual = await instance.comparer("Sol", "Sol");
    assert.isTrue(isEqual);
  });
});
