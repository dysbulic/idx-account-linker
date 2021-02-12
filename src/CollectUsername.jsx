import { useState } from 'react'
import { connect } from 'react-redux'
import {
  Box, Text, Input, Center, Stack, Link
} from '@chakra-ui/react'
import { DeleteIcon } from '@chakra-ui/icons'
import { setUsername } from './Reducer'

const CollectUsername = ({ username }) => {
  const [name, setName] = useState(username || '')

  if(username) {
    return (
      <Box><Center>
        <Text>
          Checking: {username}
          <span> </span>
          <DeleteIcon onClick={() => setUsername()}/>
        </Text>
      </Center></Box>
    )
  }

  const onSubmit = (evt) => {
    evt.preventDefault()
    setUsername(name)
  }

  return (
    <Box><Stack align='center'>
      <Text>
        ¿What's your
        <span> </span>
        <Link target='_blank' href='//github.com'>Github</Link>
        <span> </span>
        username?
      </Text>
      <Box as='form' onSubmit={onSubmit}>
        <Input
          textAlign='center'
          value={name}
          onChange={(evt) => setName(evt.target.value)}
        />
      </Box>
    </Stack></Box>
  )
}

export default connect(
  (state) => ({
    username: state.username,
  })
)(CollectUsername)