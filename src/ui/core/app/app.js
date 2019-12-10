import React, { useRef, useEffect, useState } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
} from 'react-router-dom'
import {
  Box,
  Loader,
  NavBar,
  NavBarBrand,
  NavBarMenu,
  Section,
  NavigationView,
  Menu,
  MenuLabel,
  MenuList,
  MenuListItem,
  Icon,
  NavBarEnd,
  NavBarItem,
  Button,
  useToggle,
  ModalCardBody,
  ModalCard,
  Modal,
  ModalCardFoot,
  ModalCardHead,
} from '@brightleaf/elements'
import { useAsync } from '@brightleaf/react-hooks'
import { Form, TextBox, PasswordInput } from 'react-form-elements'
import { Loading } from 'ui/components/loading'
import { AuthProvider } from 'ui/core/context/auth'
import { AppProvider } from 'ui/core/context/app'
import firebase, { firebaseAuth } from 'ui/config/firebase'
import { useFirebaseAuth } from '../hooks/use-firebase-auth'
import './app.scss'

const Home = React.lazy(() => import('ui/features/home'))
const About = React.lazy(() => import('ui/features/about'))
const Habits = React.lazy(() => import('ui/features/habits'))

const UpLink = props => {
  return <Link {...props} />
}
export default () => {
  const user = useFirebaseAuth(firebaseAuth)
  console.info(user)
  const { error, loading, execute } = useAsync(async ({ email, password }) => {
    try {
      const result = await firebaseAuth().createUserWithEmailAndPassword(
        email,
        password
      )
      console.info('the result of user create', result)
    } catch (error) {
      console.error('Error adding user: ', error)
    }
  })
  const {
    error: loginError,
    loading: loginLoading,
    execute: executeLogin,
  } = useAsync(async ({ email, password }) => {
    try {
      await firebaseAuth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)

      const result = await firebaseAuth().signInWithEmailAndPassword(
        email,
        password
      )
      console.info('the result of user login', result)
      return result
    } catch (error) {
      console.error('Error adding user: ', error)
    }
  })
  const {
    error: logouError,
    loading: logoutLoading,
    execute: executeLogout,
  } = useAsync(async () => {
    console.info('logout')
    try {
      const result = await firebaseAuth().signOut()
      console.info('the result of user logout', result)
      return result
    } catch (error) {
      console.error('Error logging user out: ', error)
    }
  })
  const [registerModalShown, setRegisterModalShown] = useToggle(false)
  const [loginModalShown, setLoginModalShown] = useToggle(false)

  const formRef = useRef(null)
  const loginRef = useRef(null)

  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <NavigationView isStatic>
            <Menu>
              <MenuLabel>General</MenuLabel>
              <MenuList className="menu-list">
                <MenuListItem>
                  <UpLink to="/">
                    <Icon fas icon="home" /> Home
                  </UpLink>
                </MenuListItem>
                <MenuListItem>
                  <UpLink to="/about">
                    <Icon fas icon="lightbulb" /> About
                  </UpLink>
                </MenuListItem>
                <MenuListItem>
                  <UpLink to="/habits">
                    <Icon fas icon="chart-line" /> Habits
                  </UpLink>
                </MenuListItem>
              </MenuList>
              <br />
              <MenuLabel>
                <Icon fas icon="book" /> Documentation
              </MenuLabel>
              <MenuList className="menu-list">
                <MenuListItem>
                  <a href="https://brightleaf.dev/elements">
                    <Icon fas icon="lightbulb" /> Brightleaf Elements
                  </a>
                </MenuListItem>
                <MenuListItem>
                  <a href="https://brightleaf.dev/hooks">
                    <Icon fas icon="sun" /> React Hooks
                  </a>
                </MenuListItem>
              </MenuList>
            </Menu>
          </NavigationView>
          <NavBar isFixedTop className="is-radiusless">
            <NavBarBrand
              src="/favicon-32x32.png"
              href="/"
              target="navTarget"
              width="32"
              height="32"
            ></NavBarBrand>
            <NavBarMenu>
              <NavBarEnd>
                {!user && (
                  <>
                    <NavBarItem>
                      <div>
                        <Button
                          isSmall
                          isPrimary
                          onClick={e => {
                            e.preventDefault()
                            setRegisterModalShown(true)
                          }}
                        >
                          Register
                        </Button>
                      </div>
                    </NavBarItem>
                    <NavBarItem>
                      <div>
                        <Button
                          isSmall
                          onClick={e => {
                            e.preventDefault()
                            setLoginModalShown(true)
                          }}
                        >
                          Login
                        </Button>
                      </div>
                    </NavBarItem>
                  </>
                )}
                {user && (
                  <NavBarItem>
                    <div>
                      <Button
                        isSmall
                        onClick={e => {
                          console.log('log out click')
                          e.preventDefault()
                          executeLogout()
                        }}
                      >
                        Log out
                      </Button>
                    </div>
                  </NavBarItem>
                )}
              </NavBarEnd>
            </NavBarMenu>
          </NavBar>
          <Section>
            <React.Suspense fallback={<Loading />}>
              <Switch>
                <Route path="/about">
                  <About />
                </Route>
                <Route path="/habits">
                  <Habits user={user} />
                </Route>
                <Route path="/">
                  <Home />
                </Route>
              </Switch>
            </React.Suspense>
          </Section>
          <Modal
            includeTrigger={false}
            ModalType={ModalCard}
            triggerFn={setRegisterModalShown}
            isActive={registerModalShown}
          >
            <ModalCardHead title="Register"></ModalCardHead>
            <ModalCardBody>
              <Form
                name="habit"
                ref={formRef}
                onSubmit={data => {
                  execute(data)
                }}
              >
                <TextBox
                  className="field control"
                  name="email"
                  labelClassName="label"
                  inputClassName="input"
                  label="Email"
                />
                <PasswordInput
                  className="field control"
                  name="password"
                  labelClassName="label"
                  inputClassName="input"
                  label="Password"
                />
              </Form>
            </ModalCardBody>
            <ModalCardFoot>
              <Button
                isSuccess
                onClick={e => {
                  e.preventDefault()

                  formRef.current.submit()
                  setRegisterModalShown(false)
                }}
              >
                Create Account
              </Button>
              <Button
                onClick={e => {
                  e.preventDefault()
                  setRegisterModalShown(false)
                }}
              >
                Cancel
              </Button>
            </ModalCardFoot>
          </Modal>
          <Modal
            includeTrigger={false}
            ModalType={ModalCard}
            triggerFn={setLoginModalShown}
            isActive={loginModalShown}
          >
            <ModalCardHead title="Login"></ModalCardHead>
            <ModalCardBody>
              <Form
                name="habit"
                ref={loginRef}
                onSubmit={data => {
                  // execute(data)
                  executeLogin(data)
                }}
              >
                <TextBox
                  className="field control"
                  name="email"
                  labelClassName="label"
                  inputClassName="input"
                  label="Email"
                />
                <PasswordInput
                  className="field control"
                  name="password"
                  labelClassName="label"
                  inputClassName="input"
                  label="Password"
                />
              </Form>
            </ModalCardBody>
            <ModalCardFoot>
              <Button
                isSuccess
                onClick={e => {
                  e.preventDefault()

                  loginRef.current.submit()
                  setLoginModalShown(false)
                }}
              >
                Login
              </Button>
              <Button
                onClick={e => {
                  e.preventDefault()
                  setLoginModalShown(false)
                }}
              >
                Cancel
              </Button>
            </ModalCardFoot>
          </Modal>
          <Modal includeTrigger={false} isActive={loading || loginLoading}>
            <Box>
              <Loader isSize1 />
            </Box>
          </Modal>
        </AppProvider>
      </AuthProvider>
    </Router>
  )
}
