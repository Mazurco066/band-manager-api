// Dependencies
import { curry, clone, dissocPath } from 'ramda'

// Ommit deep keys function
const omitDeep = curry((keys, obj) => {
  if(!keys || keys.length === 0) return obj
  let newObj = clone(obj)

  // Map key props
  keys.forEach((key: string) => {
    // TODO: Verify if key is a nested array (just the 1 level ll do the job)

    const keyParts = key.split('.')
    newObj = dissocPath(keyParts, newObj)
  })

  // Return sanitized object
  return newObj
})

//Beutify json function
export const sanitizeJson = (json: Array<any> | any, propsToRemove: string[]) => {
  // List remove
  if (Array.isArray(json)) {
    return json.map(o => {
      return omitDeep(propsToRemove, { ...o })
    })
  }

  // Single object remove
  return omitDeep(propsToRemove, { ...json })
}
