const Payment = artifacts.require("Payment");

contract("Payment", (accounts) => {
  const recipient = accounts[0];

  it("should receive payment", async () => {
    const instance = await Payment.deployed();
    await instance.receivePayment({ from: accounts[1], value: web3.utils.toWei("1", "ether") });

    const balance = await web3.eth.getBalance(instance.address);
    assert.equal(balance, web3.utils.toWei("1", "ether"));
  });

  it("should allow recipient to withdraw", async () => {
    const instance = await Payment.deployed();
    const before = await web3.eth.getBalance(recipient);

    await instance.withdraw({ from: recipient });

    const after = await web3.eth.getBalance(instance.address);
    assert.equal(after, "0");
  });
});
