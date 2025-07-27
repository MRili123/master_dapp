const AdditionContract = artifacts.require("AdditionContract");

contract("AdditionContract", () => {
  it("should return the sum of state variables using addition1()", async () => {
    const instance = await AdditionContract.deployed();
    const result = await instance.addition1();
    assert.equal(result.toString(), "8", "addition1 should return 5 + 3 = 8");
  });

  it("should return the sum of two inputs using addition2()", async () => {
    const instance = await AdditionContract.deployed();
    const result = await instance.addition2(10, 20);
    assert.equal(result.toString(), "30", "addition2(10, 20) should return 30");
  });
});
