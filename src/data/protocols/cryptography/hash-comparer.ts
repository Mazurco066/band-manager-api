export interface HashComparer {
  compare (value: string, hashedData: string): Promise<boolean> 
}
