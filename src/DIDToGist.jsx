import { connect } from "react-redux"
import { Box, useClipboard, Text, Stack } from '@chakra-ui/react'
import { CopyIcon } from '@chakra-ui/icons'

const DIDToGist = ({ did, username }) => {
  const { onCopy } = useClipboard(did)
  return (
    <Box><Stack>
      <Text>
        Copy your DID to a
        <span> </span>
        <a
          target='_blank'
          href={`//gist.github.com/${username}`}
        >gist</a>.
      </Text>
      <Text>
        <span title={did}>
          {did.slice(0, 10)}…{did.slice(-5)}
        </span>
        <span> </span>
        <CopyIcon title="copy" onClick={onCopy}/>
      </Text>
      </Stack></Box>
  )
}

export default connect(
  (state) => ({
    did: state.did,
    username: state.username,
  })
)(DIDToGist)