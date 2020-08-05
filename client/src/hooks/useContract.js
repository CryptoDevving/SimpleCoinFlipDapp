import { useState, useEffect } from 'react';
import SimpleCoinFlip from '../contracts/SimpleCoinFlip.json';

export default function (web3) {
  const [contract, setContract] = useState(null);

  useEffect(() => {
    if (!web3) return;

    async function _getContract() {
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleCoinFlip.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleCoinFlip.abi,
        deployedNetwork && deployedNetwork.address
      );
      setContract(instance);
    }

    _getContract();
  }, [web3]);

  return contract;
}
