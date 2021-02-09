import { useState } from 'react'
import { connect } from "react-redux"
import { Box } from "@chakra-ui/react"
import { DeleteIcon } from '@chakra-ui/icons'
import { setUsername } from './Reducer'

const CollectUsername = ({ username }) => {
  const [name, setName] = useState(username)

  if(username) {
    return (
      <Box>
        <h1>
          Checking: {username}
          <DeleteIcon onClick={() => setUsername()}/>
        </h1>
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
      <h1>¿What's your <a href='//github,com'>Github</a> username?</h1>
      <form onSubmit={onSubmit}>
        <input
          type='text'
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