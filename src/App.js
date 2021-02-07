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
      cacheProvider: true, // optional
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

    console.info({ did: ceramic.did.id })

    //const host = 'oiekhuylog.execute-api.us-west-2.amazonaws.com'
    const host = 'localhost:3000'
    const reqURL = `http://${host}/api/v0/request-github`
    const reqRes = await fetch(reqURL, {
      method: 'post',
      body: JSON.stringify(
        { did: ceramic.did.id, username: 'dysbulic' }
      ),
    })

    const challengeCode = (await reqRes.json())?.data?.challengeCode

    console.info({ challengeCode })

    const obj = await ceramic.did.createJWS({ challengeCode })
    const jws = (
      [
        obj.signatures[0].protected,
        obj.payload,
        obj.signatures[0].signature,
      ]
      .join('.')
    )

    console.info('Valid:', await ceramic.did.verifyJWS(jws))

    const deB64 = (str) => {
      const de = Buffer.from(str, 'base64').toString()
      try {
        return JSON.parse(de)
      } catch(err) {
        return de
      } 
    }

    console.info({
      pro: deB64(obj.signatures[0].protected),
      pay: deB64(obj.payload),
      sig: deB64(obj.signatures[0].signature),
    })

    const verURL = `http://${host}/api/v0/confirm-github`
    const verRes = await fetch(verURL, {
      method: 'post',
      body: JSON.stringify({ jws }),
    })

    console.info(await verRes.json())
  }

  useEffect(() => connect(), [])

  return (
    <></>
  )
}
