import { useState, useEffect } from 'react';

export default function (web3) {
  const [accounts, setAccounts] = useState(null);

  useEffect(() => {
    if (!web3) return;

    async function _getAccounts() {
      const accounts = await web3.eth.getAccounts();
      setAccounts(accounts);
    }

    _getAccounts();
  }, [web3]);

  return accounts;
}
