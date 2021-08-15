export interface Hasher {
  encrypt(value: string): Promise<string>
}
