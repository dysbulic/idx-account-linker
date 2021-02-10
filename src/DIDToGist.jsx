import { connect } from "react-redux"
import {
  Box, useClipboard, Text, Stack, Button, useToast, Link
} from '@chakra-ui/react'
import { CopyIcon } from '@chakra-ui/icons'
import { setFailed, setPasted } from './Reducer'

const DIDToGist = ({ did, username, pasted, failed }) => {
  const { onCopy } = useClipboard(did)
  const toast = useToast()
  return (
    <Box><Stack align='center'>
      <Text>
        Copy your DID to a
        <span> </span>
        <Link
          target='_blank'
          href={`//gist.github.com/${username}`}
        >
          gist
        </Link>.
      </Text>
      <Text>
        <span title={did}>
          {did.slice(0, 10)}…{did.slice(-5)}
        </span>
        <span> </span>
        <CopyIcon title="copy" onClick={() => {
          onCopy()
          toast({
            title: 'Copied',
            status: 'success',
            duration: 2000,
            isClosable: true,
          })
        }}/>
      </Text>
      {(!pasted || failed) &&
        <Button onClick={() => {
          setPasted(true)
          setFailed(false)
        }}
        background='green.100'
        >
          ✔ Gist Created
        </Button>}
    </Stack></Box>
  )
}

export default connect(
  (state) => {
    const { did, username, pasted, failed } = state
    return {
      did, username, pasted, failed,
    }
  }
)(DIDToGist)