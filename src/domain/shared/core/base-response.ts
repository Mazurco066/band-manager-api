// Base Response Interface
export interface IBaseResponse {
  status: {
    code: number
    message: string
  }
  data: any
}

// Base Response Object
export const baseResponse = (
  status: number,
  msg: string,
  data: Object | Array<any> | string | undefined = undefined
): IBaseResponse => ({
  status: {
    code: status,
    message: msg
  },
  data: data
})
