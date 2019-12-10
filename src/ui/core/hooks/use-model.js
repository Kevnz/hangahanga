import { useQuery } from '@brightleaf/react-hooks'
import Joi from '@hapi/joi'
import DataModel from 'shared/model'
console.info('DataModel', DataModel)
const schema = { name: Joi.string() }

const createModelSchema = modelDef => {
  return DataModel(modelDef)
}
const useModel = (modelDef, params = {}) => {
  const Model = createModelSchema(modelDef)
  const model = new Model(params)

  return model

}

const useCollection = (modelDef, params = {}) => {
  const Model = createModelSchema(modelDef)
  const model = new Model(params)

  return [[model], ()=>{}, ()=>{}]

}
export { useModel, useCollection }