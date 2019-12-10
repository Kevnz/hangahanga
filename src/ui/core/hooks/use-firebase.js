import { useEffect, useState } from 'react'

const useFirebase = (firebase, collection, where) => {

const { data: habits, loading: loadingHabits, execute: getHabits } = useAsync(
  async () => {
    const dbRef = await db.collection(collection)
    const docs = await dbRef.where(...where).get()

    const docsArr = []
    docs.forEach(doc => {
      docsArr.push(doc.data())
    })

    return docsArr
  }
)