import { connect } from 'react-redux'
import { useState } from 'react'
import ConnectWallet from './ConnectWallet'
import CollectUsername from './CollectUsername'
import DIDToGist from './DIDToGist'
import CreateCredential from './CreateCredential'
import { Stack } from '@chakra-ui/react'
import { theme, ThemeProvider, CSSReset, Box, Text, Link } from "@chakra-ui/react";

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
      <Box
        bg="#FF000033" style={{
          border: '2px soild #F00',
          textIndent: 15,
        }}
        padding="1rem"
        maxW="30rem" margin="2rem auto"
      >
        <Text>This site is no longer functional. The serverless functions which checks to see that the Gist has been created is no longer running.</Text>
        <Text>The <Link textDecoration="underline" href='//self.id'>self.id</Link> project is the official Ceramic interface to create account links.</Text>
      </Box>
      <Stack align='center' spacing={5}>{comps}</Stack>
    </ThemeProvider>
  )
}

export default connect(state => {
  const { address, username, did, pasted } = state
  return { address, username, did, pasted }
})(Home)