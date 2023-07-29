interface String {
  encrypt(key: string): string
  decrypt(key: string): string
  toJSON(key: string): JSON
}
