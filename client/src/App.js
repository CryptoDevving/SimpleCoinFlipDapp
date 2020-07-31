import React, { useState, useEffect, useCallback } from 'react';
import SimpleCoinFlip from './contracts/SimpleCoinFlip.json';
import AppContainer from './components/AppContainer';
import getWeb3 from './getWeb3';

import './App.css';

export default function App() {
  const [web3, setWeb3] = useState(null);
  // const [accounts, setAccounts] = useState(null);
  const [accountBalance, setAccountBalance] = useState(null);
  const [contract, setContract] = useState(null);
  const [potentialWinnings, setPotentialWinnings] = useState(null);

  const initContract = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      const accountBalance = await web3.eth.getBalance(accounts[0]);

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleCoinFlip.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleCoinFlip.abi,
        deployedNetwork && deployedNetwork.address
      );

      setWeb3(web3);
      // setAccounts(accounts);
      setAccountBalance(parseFloat(web3.utils.fromWei(accountBalance)));
      setContract(instance);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        'Failed to load web3, accounts, or contract. Check console for details.'
      );
      console.error(error);
    }
  };

  const getRandomValue = async () => {
    if (!contract) return;
    const resp = await contract.methods.random().call();
    return parseInt(resp, 10);
  };

  const getPotentialWinnings = useCallback(async () => {
    if (!contract) return;
    const resp = await contract.methods.getPotentialWinnings().call();
    setPotentialWinnings(web3.utils.fromWei(resp));
  }, [contract, web3]);

  useEffect(() => {
    initContract();
    getPotentialWinnings();
  }, [getPotentialWinnings]);

  if (!web3) {
    return <div>Loading Web3, accounts, and contract...</div>;
  }
  return (
    <AppContainer
      potentialWinnings={potentialWinnings}
      randomFxn={getRandomValue}
      accountBalance={accountBalance}
    />
  );
}
