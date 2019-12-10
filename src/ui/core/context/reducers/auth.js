import { useLocalStorage } from '@brightleaf/react-hooks'

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

export const useAuthHook = () => {
  const [authToken, setAuthToken] = useLocalStorage('app_auth_token')
  const [authUser, setAuthUser] = useLocalStorage(
    'app_auth_user',
    initialState.user
  )

  const reducer = (state, action) => {
    const { token, user } = action.payload || { token: '', user: {} }
    switch (action.type) {
      case 'login':
        setAuthToken(token)
        setAuthUser(user)
        return { isLoggedIn: true, user: user }
      case 'logout':
        setAuthToken(null)
        setAuthUser(null)
        return initialState
      default:
        return null
    }
  }
  return { authToken, authUser, reducer }
}
