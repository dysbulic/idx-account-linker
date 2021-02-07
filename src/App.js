import Web3 from 'web3'
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { useEffect } from 'react'
import Ceramic from '@ceramicnetwork/http-client'
import { IDX } from '@ceramicstudio/idx'
import { ThreeIdConnect, EthereumAuthProvider } from '3id-connect'

import './App.css'

export default () => {
  const connect = async () => {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider, // required
        options: {
          // Δυς's dev key; not to be relied upon
          infuraId: '24eb2385c3514f3d98191ad5e4c903e7' // required
        }
      }
    }
    const web3Modal = new Web3Modal({
      cacheProvider: false, // optional
      network: 'xdai', // optional
      providerOptions, // required
      disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
    })
    const provider = await web3Modal.connect()
    const web3 = new Web3(provider)

    const addresses = await web3.eth.getAccounts()
    const threeID = new ThreeIdConnect()
    await threeID.connect(
      new EthereumAuthProvider(provider, addresses[0])
    )

    const ceramic = new Ceramic('https://ceramic-clay.3boxlabs.com')
    await ceramic.setDIDProvider(threeID.getDidProvider())
    const idx = new IDX({ ceramic })

    console.info(idx)
  }

  useEffect((() => connect()), [])

  return (
    <></>
  )
}
