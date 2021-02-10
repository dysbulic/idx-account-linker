import { connect } from 'react-redux'
import { useState } from 'react'
import ConnectWallet from './ConnectWallet'
import CollectUsername from './CollectUsername'
import DIDToGist from './DIDToGist'
import CreateCredential from './CreateCredential'
import { Stack } from '@chakra-ui/react'
import { theme, ThemeProvider, CSSReset } from "@chakra-ui/react";

const Home = ({ address, username, did, pasted }) => {
  const [ceramic, setCeramic] = useState()
  const comps = []
  comps.push(<ConnectWallet {...{ setCeramic }} key={1}/>)
  if(did) {
    comps.push(<CollectUsername key={2}/>)
    if(username) {
      comps.push(<DIDToGist key={3}/>)
      if(pasted) {
        comps.push(<CreateCredential {...{ ceramic }} key={4}/>)
      }
    }
  }
  return (
    <ThemeProvider theme={theme}>
      <CSSReset />
      <Stack align='center' spacing={5}>{comps}</Stack>
    </ThemeProvider>
  )
}

export default connect(state => {
  const { address, username, did, pasted } = state
  return { address, username, did, pasted }
})(Home)