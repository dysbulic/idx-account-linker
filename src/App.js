import Web3 from 'web3'
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { useEffect } from 'react'
import Ceramic from '@ceramicnetwork/http-client'
import { IDX } from '@ceramicstudio/idx'
import { ThreeIdConnect, EthereumAuthProvider } from '3id-connect'
import { createDefinition, publishSchema } from '@ceramicstudio/idx-tools'
import { Provider } from 'react-redux'
import collectionSchema from './akaSchema.json'
import recordSchema from './verificationSchema.json'
import Home from './Home'
import Increment from './Increment'
import { store } from './Reducer'

const username = 'dysbulic'
//const host = 'oiekhuylog.execute-api.us-west-2.amazonaws.com'
const host = 'localhost:3000'
// Δυς's dev key; not to be relied upon
const infuraId = '24eb2385c3514f3d98191ad5e4c903e7'
const ceramicSvr = 'https://ceramic-clay.3boxlabs.com'
//const ceramicSvr = 'http://localhost:7007'
const idxKey = 'aka'

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
    console.info('Starting Connect:', ceramicSvr)

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

    // const recordType = await ceramic.createDocument('tile', {
    //   deterministic: true,
    //   content: recordSchema,
    // })
    // const schemaID = recordType.id

    // const record = await ceramic.loadDocument(schemaID)

    // console.info({ sch: schemaID.toString(), r: record.content })

    const account = {
      protocol: 'https',
      host: 'github.com',
      id: acct.username,
      claim: acct.url,
      attestations: [{ 'did-jwt-vc': att }]
    }

    const collectionType = await ceramic.createDocument('tile', {
      deterministic: true,
      content: collectionSchema,
    })

    console.info({ id: collectionType.id.toUrl(), cid: collectionType.commitId.toUrl() })

    const akaDef = await createDefinition(ceramic, {
      name: 'AsKnownAs',
      description: 'Account links to an IDX DID', // optional
      schema: collectionType.commitId.toUrl(),
    })

    console.info({ akaDef })

    const idxDefs = {
      [idxKey]: [akaDef.commitId.toUrl()],
    }

    const idx = new IDX({ ceramic, aliases: idxDefs })

    const auths = (await idx.get(idxKey)) || []
    console.info(auths)
    auths.push(account)
    await idx.merge(idxKey, auths)

    console.info(idx.get(idxKey))
  }

  //useEffect(() => connect(), [])

  return (
    <Provider store={store}>
      <Home/>
    </Provider>
  )
}
