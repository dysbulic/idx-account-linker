import { useState, useEffect } from 'react'
import { connect } from "react-redux"
import { ThreeIdConnect, EthereumAuthProvider } from '3id-connect'
import Ceramic from '@ceramicnetwork/http-client'
import { Box } from '@chakra-ui/react'

const DIDToGist = ({ did, username }) => {
  return (
    <Box>
      <h1>
        Copy your DID to a
        <span> </span>
        <a
          target='_blank'
          href={`//gist.github.com/${username}`}
        >gist</a>.
      </h1>
      <h1>{did}</h1>
    </Box>
  )
}

export default connect(
  (state) => ({
    did: state.did,
    username: state.username,
  })
)(DIDToGist)