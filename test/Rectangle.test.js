const Rectangle = artifacts.require("Rectangle");

contract("Rectangle", () => {
  it("should return the correct surface", async () => {
    const instance = await Rectangle.deployed();
    const surface = await instance.surface();
    assert.equal(surface.toString(), "50"); // 5 x 10
  });

  it("should return the correct info string", async () => {
    const instance = await Rectangle.deployed();
    const msg = await instance.afficheInfos();
    assert.equal(msg, "Je suis Rectangle");
  });
});
