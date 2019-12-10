import 'regenerator-runtime/runtime'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './core/app'

ReactDOM.render(<App />, document.getElementById('root'))

if (process.env.NODE_ENV !== 'production') {
  module.hot.accept()
}
