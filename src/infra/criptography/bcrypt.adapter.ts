// Dependencies
import bcrypt from 'bcrypt'

// Protocols
import { Hasher, HashComparer } from '@/data/protocols'

// Adapter
export class BcryptAdapter implements Hasher, HashComparer {
  constructor (private readonly salt: number = 10) {}

  // Implementation of Hasher
  async encrypt (value: string): Promise<string> {
    return bcrypt.hash(value, this.salt)
  }
  // Implementation of Hash Comparer
  async compare (value: string, hashedData: string): Promise<boolean> {
    return bcrypt.compare(value, hashedData)
  }
}