import React, { useEffect, useRef, useState } from 'react'
import {
  Button,
  Section,
  Title,
  SubTitle,
  Container,
  Modal,
  ModalCard,
  ModalCardBody,
  ModalCardHead,
  ModalCardFoot,
  useToggle,
  Loader,
} from '@brightleaf/elements'
import { Form, TextBox, useFormElement } from 'react-form-elements'
import { useAsync } from '@brightleaf/react-hooks'
import cronstrue from 'cronstrue'
import Joi from '@hapi/joi'
import { useModel, useCollection } from 'ui/core/hooks/use-model'
import { db } from 'ui/config/firebase'

const FREQUENCY_KEYS = {
  '0 7 * * *': 0,
  '0 12 * * *': 1,
  '0 19 * * *': 2,
}
export default ({ user }) => {
  const formRef = useRef(null)
  const selectRef = useRef(null)
  const { id, value, handleChange, inputRef } = useFormElement('', selectRef)

  const { data, error, loading, execute } = useAsync(async habit => {
    try {
      console.log('data', habit)
      habit.createdBy = user.uid
      habit.frequencyOrder = FREQUENCY_KEYS[habit.frequency]
      const docRef = await db.collection('habits').add(habit)
      console.log('Document written with ID: ', docRef.id)
      console.info('doc', docRef)
      getHabits()
    } catch (error) {
      console.error('Error adding document: ', error)
    }
  })

  const { data: habits, loading: loadingHabits, execute: getHabits } = useAsync(
    async () => {
      const habitsRef = await db.collection('habits')
      // .orderBy('frequencyOrder', 'asc')

      const habitDocs = await habitsRef.where('createdBy', '==', user.uid).get()
      console.info('habits', habitDocs)
      const habArr = []
      habitDocs.forEach(doc => {
        console.log(`${doc.id} => ${doc.data()}`, doc.data())
        habArr.push(doc.data())
      })

      return habArr.sort((a, b) => {
        return a.frequencyOrder > b.frequencyOrder
      })
    }
  )
  const [modalShown, setModalShown] = useToggle(false)
  useEffect(() => {
    if (user === null) return
    getHabits()
  }, [user])
  console.info('habits', habits)
  const habitsList = (habits || []).map(h => (
    <li key={`habit-${h.name}`}>
      {h.name} - {cronstrue.toString(h.frequency)}
    </li>
  ))
  return (
    <Section>
      <Title>Hangahanga</Title>
      <SubTitle>(noun) practice, habit, strategy.</SubTitle>
      <Container>
        <Section>
          <Button
            isLoading={loading}
            onClick={e => {
              e.preventDefault()
              setModalShown(true)
            }}
          >
            Create Habit
          </Button>
        </Section>
        <Section>
          <Title>Habits</Title>
          <ul>{habitsList}</ul>
        </Section>
      </Container>
      <Modal
        includeTrigger={false}
        ModalType={ModalCard}
        triggerFn={setModalShown}
        isActive={modalShown}
      >
        <ModalCardHead title="Create Habit"></ModalCardHead>
        <ModalCardBody>
          <Form
            name="habit"
            ref={formRef}
            onSubmit={({ name }) => {
              console.info('inputRef', inputRef.current.value)
              const frequency = inputRef.current.value
              const newHabit = { name, frequency }
              execute(newHabit)
            }}
          >
            <TextBox
              className="field control"
              name="name"
              labelClassName="label"
              inputClassName="input"
              label="Name"
            />
            <div className="field">
              <label className="label">Frequency</label>

              <div className="control">
                <div className="select is-fullwidth">
                  <select name="frequency" ref={inputRef}>
                    <option value="0 7 * * *">Daily - Morning </option>
                    <option value="0 12 * * *">Daily - Midday </option>
                    <option value="0 19 * * *">Daily - Evening </option>
                  </select>
                </div>
              </div>
            </div>
          </Form>
        </ModalCardBody>
        <ModalCardFoot>
          <Button
            isSuccess
            onClick={e => {
              e.preventDefault()
              console.log('form', formRef.current)
              formRef.current.submit()
              setModalShown(false)
            }}
          >
            Create Habit
          </Button>
          <Button
            onClick={e => {
              e.preventDefault()
              setModalShown(false)
            }}
          >
            Cancel
          </Button>
        </ModalCardFoot>
      </Modal>
    </Section>
  )
}
/*
          <DropDownMenu
                        label={selected}
                        isUp
                        className="is-fullwidth"
                      >
                        <DropDownItem
                          onClick={e => {
                            e.preventDefault()
                            setSelected('Daily - Morning')
                            setSelectedFrequency('0 7 * * *')
                          }}
                        >
                          Daily - Morning
                        </DropDownItem>

                        <DropDownItem
                          onClick={e => {
                            e.preventDefault()
                            setSelected('Daily - Midday')
                            setSelectedFrequency('0 12 * * *')
                          }}
                        >
                          Daily - Midday
                        </DropDownItem>
                        <DropDownItem
                          onClick={e => {
                            e.preventDefault()
                            setSelected('Daily - Evening')
                            setSelectedFrequency('0 19 * * *')
                          }}
                        >
                          Daily - Evening
                        </DropDownItem>
                      </DropDownMenu>
                      */
