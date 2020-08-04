const SimpleCoinFlip = artifacts.require("SimpleCoinFlip");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(SimpleCoinFlip).then(instance => {
    web3.eth.sendTransaction({
      from: accounts[0],
      to: instance.address,
      value: web3.utils.toWei('5', 'ether')
    }).catch(e => {
      console.log(`Error : ${e}`);
    });
  });
};
