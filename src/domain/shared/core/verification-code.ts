interface Options {
  type: string
}

export const generateVerificationCode = (length: number, options?: Options) : string | number => {
  const possibleDigits = '0123456789'
  const digits = []
  for (let i = 0; i < length; i++) {
    digits.push(possibleDigits.charAt(Math.floor(Math.random() * possibleDigits.length)))
  }
  const code = digits.reduce((ac, cv) => ac += cv, '')
  return (options && options.type) === 'number' ? parseFloat(code) : code
}
