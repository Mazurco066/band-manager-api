import { TokenPayload } from '@/data/protocols'

export interface Authorizer {
  sign(payload: TokenPayload): Promise<string>
}