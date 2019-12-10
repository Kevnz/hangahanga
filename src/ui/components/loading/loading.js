import React from 'react'
import { Progress } from 'react-form-elements'

export default function Loading() {
  return (
    <div className="loading-indicator">
      <Progress
        label="Loading"
        labelClassName="label"
        progressClassName="progress is-small is-primary"
        max="100"
        initialValue={null}
      />
    </div>
  )
}
