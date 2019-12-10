import { useEffect, useState } from 'react'

const useFirebaseAuth = firebaseAuth => {
  const [user, setUser] = useState(null)
  useEffect(
    () =>
      firebaseAuth().onAuthStateChanged(_user => {
        // console.log('auth on', _user)
        setUser(_user)
      }),
    [firebaseAuth]
  )
  return user
}

export { useFirebaseAuth }
