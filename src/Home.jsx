import { connect } from 'react-redux'
import { useState } from 'react'
import ConnectWallet from './ConnectWallet'
import CollectUsername from './CollectUsername'
import DIDToGist from './DIDToGist'
import CreateCredential from './CreateCredential'

const Home = ({ address, username, did }) => {
  const [ceramic, setCeramic] = useState()
  const comps = []
  comps.push(<ConnectWallet {...{ setCeramic }}/>)
  if(did) {
    comps.push(<CollectUsername/>)
    if(username) {
      comps.push(<DIDToGist/>)
      comps.push(<CreateCredential {...{ ceramic }}/>)
    }
  }
  return comps
}

export default connect(state => {
  const { address, username, did } = state
  return { address, username, did }
})(Home)