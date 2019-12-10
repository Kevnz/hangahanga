import React, { createContext, useReducer, useEffect } from 'react'
import { useAuthHook } from './reducers/auth'

const initialState = {
  isLoggedIn: false,
  loggingIn: false,
  user: {
    id: 0,
    firstName: 'Anonymous',
    lastName: 'User',
    email: '',
    username: 'Anonymous_User',
  },
}

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const { authToken, authUser, reducer } = useAuthHook()

  const hydratedState = authToken
    ? {
        isLoggedIn: true,
        loggingIn: false,
        user: authUser,
      }
    : initialState

  const [state, dispatch] = useReducer(reducer, hydratedState)
  useEffect(() => {
    if (state && state.loggingIn) {
      console.info('logging in')
    }
  }, [state, state.loggingIn])

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  )
}
