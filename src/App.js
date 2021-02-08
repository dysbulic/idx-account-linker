import Web3 from 'web3'
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { useEffect } from 'react'
import Ceramic from '@ceramicnetwork/http-client'
//import { IDX } from '@ceramicstudio/idx'
import { ThreeIdConnect, EthereumAuthProvider } from '3id-connect'
import schema from './akaSchema.json'

import './App.css'

const username = 'dysbulic'
//const host = 'oiekhuylog.execute-api.us-west-2.amazonaws.com'
const host = 'localhost:3000'
// Δυς's dev key; not to be relied upon
const infuraId = '24eb2385c3514f3d98191ad5e4c903e7'
const ceramicSvr = 'https://ceramic-clay.3boxlabs.com'

// Reverse base 64 encoding to an object if possible
const deB64 = (str) => {
  const de = Buffer.from(str, 'base64').toString()
  try {
    return JSON.parse(de)
  } catch(err) {
    return de
  } 
}

// Convert the object representation of a JWT to a string
const jwtStr = (obj) => (
  [
    obj.signatures[0].protected,
    obj.payload,
    obj.signatures[0].signature,
  ]
  .join('.')
)

export default () => {
  const connect = async () => {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider, // required
        options: {
          infuraId // required
        }
      }
    }
    const web3Modal = new Web3Modal({
      cacheProvider: true, // optional
      // network: 'xdai', // optional
      providerOptions, // required
    })
    const provider = await web3Modal.connect()
    const web3 = new Web3(provider)

    const addresses = await web3.eth.getAccounts()
    const threeID = new ThreeIdConnect()
    await threeID.connect(
      new EthereumAuthProvider(provider, addresses[0])
    )

    const ceramic = new Ceramic(ceramicSvr)
    await ceramic.setDIDProvider(threeID.getDidProvider())

    console.info({ did: ceramic.did.id })

    let url = `http://${host}/api/v0/request-github`
    let res = await fetch(url, {
      method: 'post',
      body: JSON.stringify(
        { did: ceramic.did.id, username }
      ),
    })

    const challengeCode = (await res.json())?.data?.challengeCode

    console.info({ challengeCode })

    const jws = jwtStr(
      await ceramic.did.createJWS({ challengeCode })
    )

    console.info('Valid:', await ceramic.did.verifyJWS(jws))

    url = `http://${host}/api/v0/confirm-github`
    res = await fetch(url, {
      method: 'post',
      body: JSON.stringify({ jws }),
    })

    const datum = await res.json()
    if(datum.status === 'error') throw datum.message
    const att = datum?.data?.attestation
    if(!att) throw 'missing data'
    const parts = att?.split('.').map(deB64)
    const acct = parts[1].vc.credentialSubject.account

    console.info(schema)
    const recordType = await ceramic.createDocument('tile', {
      deterministic: true,
      content: schema,
    })
    const schemaID = recordType.id.toString()

    const record = await ceramic.loadDocument(schemaID)

    console.info({ schemaID, r: record.content })

    const doc = {
      protocol: 'https',
      host: 'github.com',
      id: acct.username,
      claim: acct.url,
      attestations: [{ 'did-jwt-vc': att }]
    }
    console.info(doc)
    const instance = await ceramic.createDocument('tile', {
      metadata: {
        schema: schemaID.commitId,
      },
      content: doc,
    })

    const rec = await ceramic.loadDocument(instance.id)

    console.info({ ins: instance.id.toString(), r: rec?.content })
  }

  useEffect(() => connect(), [])

  return (
    <></>
  )
}
