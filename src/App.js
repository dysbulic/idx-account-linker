import { Provider } from 'react-redux'
import Home from './Home'
import { store } from './Reducer'

export default () => (
  <Provider store={store}>
    <Home/>
  </Provider>
)
