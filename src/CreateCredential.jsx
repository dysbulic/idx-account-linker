import { useState, useEffect } from 'react'
import { connect } from "react-redux"
import {
  Box, Spinner, Text, Alert, AlertDescription, AlertIcon
} from '@chakra-ui/react'
import { createDefinition, publishSchema } from '@ceramicstudio/idx-tools'
import { IDX } from '@ceramicstudio/idx'
import akaSchema from './akaSchema.json'
import { setFailed } from './Reducer'

//const verifier = 'http://localhost:3000'
const verifier = 'https://oiekhuylog.execute-api.us-west-2.amazonaws.com/develop'
const idxKey = 'aka'

// Reverse base 64 encoding to an object if possible
const deB64 = (str) => {
  const de = Buffer.from(str, 'base64').toString()
  try {
    return JSON.parse(de)
  } catch(err) {
    return de
  } 
}

// Convert the object representation of a JWT to a string
const jwtStr = (obj) => (
  [
    obj.signatures[0].protected,
    obj.payload,
    obj.signatures[0].signature,
  ]
  .join('.')
)

const CreateCredential = ({ did, username, failed, ceramic }) => {
  const [done, setDone] = useState(false)
  const [error, setError] = useState()
  const create = async () => {
    try {
      let url = `${verifier}/api/v0/request-github`
      console.info(JSON.stringify(
        { did, username }
      ))
      let res = await fetch(url, {
        method: 'post',
        body: JSON.stringify(
          { did, username }
        ),
      })
      let datum = await res.json()
      const challengeCode = datum?.data?.challengeCode

      if(!challengeCode) throw new Error("Couldn't generate challenge")
      
      const jws = jwtStr(
        await ceramic.did.createJWS({ challengeCode })
      )

      //console.info('Valid:', await ceramic.did.verifyJWS(jws))

      url = `${verifier}/api/v0/confirm-github`
      res = await fetch(url, {
        method: 'post',
        body: JSON.stringify({ jws }),
      })

      datum = await res.json()
      if(datum.status === 'error') throw new Error(datum.message)
      if(datum.status >= 300) throw new Error(datum.body)
      const att = datum?.data?.attestation
      if(!att) throw new Error('missing attestation')
      const parts = att?.split('.').map(deB64)
      const acct = parts[1].vc.credentialSubject.account

      const account = {
        protocol: 'https',
        host: 'github.com',
        id: acct.username,
        claim: acct.url,
        attestations: [{ 'did-jwt-vc': att }]
      }

      const akaType = await ceramic.createDocument('tile', {
        deterministic: true,
        content: akaSchema,
      })

      console.info('akaType', { id: akaType.id.toUrl(), commit: akaType.commitId.toUrl() })

      // const typeId = akaType.commitId.toUrl()
      const typeId = "ceramic://k6zn3rc3v8qin13uvxmmnn34rp2hiccdt9u2rgqqbg3prksqybhktcs76pzprnd9okf7wf1ijl1cj4rr934ys896vmb11h4uzl0e3zicvc312jfklwd1bam"

      const akaDef = await createDefinition(ceramic, {
        name: 'AsKnownAs',
        description: 'Account links to an IDX DID', // optional
        schema: typeId,
      })

      console.info('akaDef', { id: akaDef.id.toUrl(), commit: akaDef.commitId.toUrl() })

      const idxDefs = {
        // [idxKey]: [akaDef.commitId.toUrl()],
        [idxKey]: [akaDef.id.toUrl()],
      }

      const idx = new IDX({ ceramic, aliases: idxDefs })

      const aka = (await idx.get(idxKey)) || { accounts: [] }

      console.info('existing', { ...aka })

      if(!aka.accounts) throw new Error(`malformed ${idxKey} entry`)
      aka.accounts.push(account)

      console.info('new', { ...aka })

      console.info('repo', (await idx.merge(idxKey, aka)).toUrl())
      setDone(true)
    } catch(err) {
      console.error(err)
      setError(err.message)
      setFailed(true)
    }
  }

  useEffect(() => {
    if(!failed) {
      setError()
      create()
    }
  }, [failed])

  if(error) {
    return (
      <Box><Alert status="error">
        <AlertIcon />
        <AlertDescription>{error}</AlertDescription>
      </Alert></Box>
    )
  }

  if(!done) {
    return (
      <Box align='center'>
        <Text>Verifying gist for {username}. <Spinner/></Text>
      </Box>
    )
  }

  return (
    <Box align='center'><Text>Verified</Text></Box>
  )
}

export default connect(
  (state) => {
    const { did, username, failed } = state
    return {
      did, username, failed,
    }
  }
)(CreateCredential)