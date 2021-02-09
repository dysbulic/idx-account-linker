import { connect } from 'react-redux'
import React from 'react'
import { next } from './Reducer'

export default () => (
  <button onClick={next}>+</button>
)
