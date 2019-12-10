import React from 'react'
import { Router, Location } from '@reach/router'
import classnames from 'classnames'
import styles from './router.module.scss'

const AnimatedRouter = props => {
  return (
    <Location>
      {({ location }) => {
        console.log('Router location', location)
        return (
          <div
            key={location.key}
            className={classnames(styles.animated, {
              [styles.slideInRight]: true,
              [styles.slideInLeft]:
                location.state && location.state.move === 'back',
            })}
          >
            <Router location={location}>{props.children}</Router>
          </div>
        )
      }}
    </Location>
  )
}

export { AnimatedRouter }

export default AnimatedRouter
