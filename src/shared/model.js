import Joi from '@hapi/joi'
import clone from 'clone'
console.info('Joi', Joi)
/**
 * Applies properties for the keys in the schema
 * onto the the data prop
 *
 * @param { KeySchema } keySchema - the schema of keys to add to
 * @param { Prototype } proto - the prototype to apply the properties to
 * @param { Symbol } dataProp - the property in which data is applied
 */
function _applyKeySchemaToProto (keySchema, proto, dataProp) {
  for (const key in keySchema) {
    Object.defineProperty(proto, key, {
      get () {
        return this[dataProp][key]
      },

      set (value) {
        const schema = keySchema[key]
        this[dataProp][key] = Joi.attempt(value, schema)
      }
    })
  }
}

/**
 * Validates an objected using the schema
 *
 * @param { Object } input - the data to validate
 * NOTE: input defaults to an empty object to ensure that undefined
 * input does not pass through validation unchecked
 * @param { JoiSchema } schema - the schema to use for validation
 * @param { JoiValidationOptions } validationOptions - options to apply for when validating
 *
 * @returns { Object } value - the validated data
 */
function _validateSchema (input = {}, schema, validationOptions) {
  const { value, error } = schema.validate(input, validationOptions)

  if (error) {
    throw error
  }

  return value
}

/**
 * Defines a model based on the input key schema
 *
 * @param { KeySchema } keySchema - the schema to use for validation
 * @param { JoiValidationOptions } validationOptions - the options to use for
 * validating the input
 *
 * @returns { Model } model - the model that can be used for validation
 */
export default function define (keySchema, validationOptions) {
  const schema = Joi.object().keys(keySchema)

  const dataProp = Symbol('data')
  const validateProp = Symbol('validate')

  class Model {
    /**
     * Returns a new sub model that extends the base model
     *
     * @param { KeySchema } extendedSchema - the schema apply over the original schema
     * @param { JoiValidationOptions } validationOptions - joi schema validation options
     *
     * @returns { Model }
     */
    static extend (extendedSchema, extendedValidationOptions) {
      const newSchema = Joi.object()
        .keys({ ...keySchema, ...extendedSchema })
      const newValidationOptions = { ...validationOptions, ...extendedValidationOptions }

      // new model extends the current model but overrides the validation function
      class NewModel extends this {}

      _applyKeySchemaToProto(newSchema, NewModel.prototype, dataProp)

      NewModel.prototype[validateProp] = function (input) {
        return _validateSchema(input, newSchema, newValidationOptions)
      }

      return NewModel
    }

    /**
     * Plain vanilla joi schema validation
     *
     * @param { Object } input - the object to validate
     *
     * @returns { Object } data - the validated data
     */
    static validate (input) {
      return _validateSchema(input, schema, validationOptions)
    }

    /**
     * Returns the joi schema used by the model
     *
     * @returns { JoiSchema }
     */
    static getSchema () {
      return schema
    }

    /**
     * @param { Object } input - the incoming data to validate
     */
    constructor (input) {
      this[dataProp] = this[validateProp](input)
    }

    /**
     * Return the pure json representation of the model
     * Note: this also allows for the model to be stringified
     *
     * @returns { Object } object - the pure data
     */
    toJSON () {
      return clone(this[dataProp])
    }
    persist (fn) {
      console.info('PERSIST')
      return(fn(this.toJSON()))
    }
  }

  _applyKeySchemaToProto(keySchema, Model.prototype, dataProp)

  /**
   * @param { Object } input - the data to validate
   *
   * @returns { Object } validatedData - the data to validate
   */
  Model.prototype[validateProp] = function (input) {
    return _validateSchema(input, schema, validationOptions)
  }

  return Model
}


