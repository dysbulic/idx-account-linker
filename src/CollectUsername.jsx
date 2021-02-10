import { useState } from 'react'
import { connect } from "react-redux"
import { Box, Text, Input } from "@chakra-ui/react"
import { DeleteIcon } from '@chakra-ui/icons'
import { setUsername } from './Reducer'

const CollectUsername = ({ username }) => {
  const [name, setName] = useState(username)

  if(username) {
    return (
      <Box>
        <Text>
          Checking: {username}
          <span> </span>
          <DeleteIcon onClick={() => setUsername()}/>
        </Text>
      </Box>
    )
  }

  const onSubmit = (evt) => {
    console.info('SUB', username)
    evt.preventDefault()
    setUsername(name)
  }

  return (
    <Box>
      <Text>¿What's your <a href='//github,com'>Github</a> username?</Text>
      <form onSubmit={onSubmit}>
        <Input
          onChange={evt => setName(evt.target.value)}
        />
      </form>
    </Box>
  )
}

export default connect(
  (state) => ({
    username: state.username,
  })
)(CollectUsername)