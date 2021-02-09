import { createSlice, configureStore } from '@reduxjs/toolkit'

const initial = {
  step: 1,
  address: null,
  username: null,
}

const pageSlice = createSlice({
  name: 'page',
  initialState: initial,
  reducers: {
    nextPage: state => ({ ...state, step: state.step + 1 }),
    lastPage: state => ({ ...state, step: state.step + 1 }),
    setAddress: (state, action) => (
      { ...state, address: action.payload }
    ),
    setUsername: (state, action) => (
      { ...state, username: action.payload }
    ),
    setDID: (state, action) => (
      { ...state, did: action.payload }
    ),
  },
})

export const store = configureStore({
  reducer: pageSlice.reducer
})

export const next = () => (
  store.dispatch(pageSlice.actions.nextPage())
)
export const previous = () => (
  store.dispatch(pageSlice.actions.previousPage())
)
export const setAddress = (addr) => (
  store.dispatch(pageSlice.actions.setAddress(addr))
)
export const setUsername = (user) => (
  store.dispatch(pageSlice.actions.setUsername(user))
)
export const setDID = (did) => (
  store.dispatch(pageSlice.actions.setDID(did))
)