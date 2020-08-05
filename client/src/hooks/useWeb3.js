import getWeb3 from '../apis/getWeb3';
import { useState, useEffect } from 'react';

export default function () {
  const [web3, setWeb3] = useState(null);

  useEffect(() => {
    async function _getWeb3() {
      const w3 = await getWeb3();
      setWeb3(w3);
    }

    _getWeb3();
  }, []);

  return web3;
}
