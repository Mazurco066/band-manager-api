/**
 * Object search filter
 * @argument key: value
 *
 * @description you may use key as string with number or string value
 *
 * @example { email: "some_email@domain.com" }
 * { id: 1 }
 * { name: "Name" }
 */
export type Filter = {
  [key in string | number]: string | number
}


