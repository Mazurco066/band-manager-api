// Dependencies
import { curry, clone, dissocPath } from 'ramda'

// Ommit deep keys function
const omitDeep = curry((keys, obj) => {
  if(!keys || keys.length === 0) return obj
  let newObj = clone(obj)

  // Map key props
  keys.forEach((key: string) => {
    // Split key ex: "members._id" => "['members', '_id]"
    const keyParts = key.split('.')

    // Nested array validation else will be treated like a common object
    if (Array.isArray(newObj[keyParts[0]]) && keyParts.length > 1) {
      newObj[keyParts[0]] = newObj[keyParts[0]].map((sub: any) => 
        dissocPath(keyParts.filter((_, idx) => idx !== 0), sub))
    } else {
      newObj = dissocPath(keyParts, newObj)
    }
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
