import React, { createContext, useEffect } from 'react'

const initialState = {

}

export const AppContext = createContext()

export const AppProvider = ({ children }) => {
  useEffect(() => {}, [])

  return (
    <AppContext.Provider value={initialState}>{children}</AppContext.Provider>
  )
}
