import Web3 from 'web3'
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'

import './App.css'

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      // Δυς's dev key; not to be relied upon
      infuraId: '24eb2385c3514f3d98191ad5e4c903e7' // required
    }
  }
}

export default async () => {
  const web3Modal = new Web3Modal({
    network: 'xdai', // optional
    cacheProvider: true, // optional
    providerOptions // required
  })
  
  const provider = await web3Modal.connect()
  const web3 = new Web3(provider)
  
  return (
    null
  );
}
