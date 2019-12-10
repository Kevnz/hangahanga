import React from 'react'
import { Section, Title, SubTitle } from '@brightleaf/elements'
import { Link } from 'react-router-dom'
export default () => (
  <Section>
    <Title>Hangahanga</Title>
    <SubTitle>(noun) practice, habit, strategy.</SubTitle>
    <Link to="/habits" className="button is-info">
      Start
    </Link>
  </Section>
)
