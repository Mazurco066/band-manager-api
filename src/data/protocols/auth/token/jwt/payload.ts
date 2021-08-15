
// Domain Protocols
import { RoleEnum } from '@/domain/protocols'

export interface TokenPayload {
  account: string
  role: RoleEnum
}