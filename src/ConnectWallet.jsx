import { useState } from 'react'
import Web3 from 'web3'
import Web3Modal, { connectors } from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { ThreeIdConnect, EthereumAuthProvider } from '3id-connect'
import { setAddress, setDID } from './Reducer'
import { connect } from 'react-redux'
import { Box, Button, Spinner, Stack, Text } from '@chakra-ui/react'
import { DeleteIcon } from '@chakra-ui/icons'
import Ceramic from '@ceramicnetwork/http-client'
import { getInjectedProvider } from 'web3modal'
import { useEffect } from 'react'

// Δυς's dev key; not to be relied upon
const infuraId = '24eb2385c3514f3d98191ad5e4c903e7'
const ceramicSvr = 'https://ceramic-clay.3boxlabs.com'

const ConnectWallet = ({ address, setCeramic, did }) => {
  const [web3, setWeb3] = useState()

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

  //console.info(getInjectedProvider())

  const connect = async () => {
    const provider = await web3Modal.connect()
    const web3 = new Web3(provider)
    setWeb3(web3)

    const addresses = await web3.eth.getAccounts()
    const address = addresses[0]
    setAddress(address)

    const threeID = new ThreeIdConnect()
    await threeID.connect(
      new EthereumAuthProvider(provider, address)
    )

    const ceramic = new Ceramic(ceramicSvr)
    await ceramic.setDIDProvider(threeID.getDidProvider())
    setCeramic(ceramic)

    setDID(ceramic.did.id)
  }

  const enableIfInjected = async () => {
    if(!did && web3Modal.cachedProvider === 'injected') {
      await connect()
    }
  }

  useEffect(() => enableIfInjected(), [])

  if(address) {
    return (
      <Stack>
        <Text>
          Using:
          <span> </span>
          <span title={address}>
            {address.slice(0, 10)}…{address.slice(-5)}
          </span>
          <span> </span>
          <DeleteIcon onClick={async () => {
            setAddress()
            web3?.currentProvider?.disconnect && await web3.currentProvider.disconnect()
          }}/>
        </Text>
        {!did && <Box><Spinner/></Box>}
      </Stack>
    )
  }

  return (
    <Box>
      <Button onClick={connect}>Connect Your Wallet</Button>
    </Box>
  )
}

export default connect(
  (state) => ({
    address: state.address,
    did: state.did,
  }),
)(ConnectWallet)