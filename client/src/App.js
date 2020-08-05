import React, { useState, useEffect, useCallback } from 'react';
import useWeb3 from './hooks/useWeb3';
import useContract from './hooks/useContract';
import useAccounts from './hooks/useAccounts';
import AppContainer from './components/AppContainer';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { v4 as uuidv4 } from 'uuid';
import Promise from 'bluebird';

export default function App() {
  const web3 = useWeb3();
  const contract = useContract(web3);
  const accounts = useAccounts(web3);

  const [accountBalance, setAccountBalance] = useState(null);
  const [currentJackpot, setCurrentJackpot] = useState(null);
  const [latestLogId, setLatestLogId] = useState(null);

  const placeBet = useCallback(
    async (bet) => {
      const betId = uuidv4();
      if (!contract) return;

      const receiptPromise = new Promise((resolve, reject) => {
        contract.methods
          .bet(betId)
          .send({
            from: accounts[0],
            value: web3.utils.toWei(bet, 'ether'),
          })
          .on('receipt', (receipt) => {
            resolve(receipt);
          })
          .on('error', (error) => {
            reject(error);
          });
      });
      const eventPromise = new Promise((resolve, reject) => {
        contract.once(
          'FlipOutcome',
          { uuid: betId, gambler: accounts[0] },
          (error, event) => {
            resolve(event.returnValues.didWin);
          }
        );
      });
      const [, didWin] = await Promise.all([receiptPromise, eventPromise]);
      return didWin;
    },
    [contract, accounts, web3]
  );

  useEffect(
    function initialize() {
      async function _initialize() {
        if (contract) {
          contract.events.FlipOutcome(async (error, event) => {
            setLatestLogId(event.id);
          });
        }
      }
      _initialize();
    },
    [contract]
  );

  useEffect(
    function setJackpot() {
      async function _setJackpot() {
        const resp = await contract.methods.getCurrentJackpot().call();
        return setCurrentJackpot(web3.utils.fromWei(resp));
      }
      if (web3 && contract) {
        _setJackpot();
      }
    },
    [web3, contract, latestLogId]
  );

  useEffect(
    function setBalance() {
      async function _setBalance() {
        const accountBalance = await web3.eth.getBalance(accounts[0]);
        setAccountBalance(parseFloat(web3.utils.fromWei(accountBalance)));
      }
      if (web3 && accounts) {
        _setBalance();
      }
    },
    [web3, accounts, latestLogId]
  );

  if (!web3) {
    return (
      <Container maxWidth="sm">
        <Box
          pt={33}
          color="primary.main"
          display="flex"
          justifyContent="center"
        >
          <Typography variant="h2">Loading...</Typography>
        </Box>
      </Container>
    );
  }
  return (
    <AppContainer
      currentJackpot={currentJackpot}
      placeBet={placeBet}
      accountBalance={accountBalance}
    />
  );
}
