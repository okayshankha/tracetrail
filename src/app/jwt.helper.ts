import { resolve } from 'path'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { generateKeyPairSync } from 'crypto'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { Logger } from '../core/logger'

export interface IJWTHelperConstructorP {
  PVT_KEY_SECRET: string
  JWT_EXPIRY_SECS?: number
}

const DEFAULT_JWT_EXPIRY_SECS = 60 * 60

export default class JWTHelper {
  private PVT_KEY_SECRET: string
  private JWT_EXPIRY_SECS: number
  private keyDir = resolve(`${process.cwd()}/.tracetrail/keys`)
  private publicKeyPath = resolve(`${this.keyDir}/rsa.pub`)
  private privateKeyPath = resolve(`${this.keyDir}/rsa`)
  private publicKey: Buffer
  private privateKey: Buffer

  constructor({
    PVT_KEY_SECRET,
    JWT_EXPIRY_SECS = DEFAULT_JWT_EXPIRY_SECS,
  }: IJWTHelperConstructorP) {
    this.PVT_KEY_SECRET = PVT_KEY_SECRET
    this.JWT_EXPIRY_SECS = JWT_EXPIRY_SECS
    this.GenerateKeys()
    this.publicKey = readFileSync(this.publicKeyPath)
    this.privateKey = readFileSync(this.privateKeyPath)
  }

  /**
   * Verify the token with rsa public key.
   * @param {string} token
   * @returns string | JwtPayload
   */
  VerifyToken(token: string): JwtPayload | null {
    try {
      return jwt.verify(token, this.publicKey, {
        algorithms: ['RS256'],
      }) as JwtPayload // Payload of jwt in this library would be valid standard object and not string.
    } catch (error) {
      Logger.error(error)
    }
    return null
  }

  /**
   * Create a signed JWT with the rsa private key.
   * @returns token
   */
  GenerateToken(): string {
    return jwt.sign(
      Math.random().toString(),
      { key: this.privateKey, passphrase: this.PVT_KEY_SECRET },
      {
        algorithm: 'RS256',
        expiresIn: this.JWT_EXPIRY_SECS,
      },
    )
  }

  /**
   * Generates RSA Key Pairs for JWT authentication
   * It will generate the keys only if the keys are not present.
   */
  GenerateKeys(): void {
    try {
      const keyDir = this.keyDir
      const publicKeyPath = this.publicKeyPath
      const privateKeyPath = this.privateKeyPath

      const JWT_SECRET = this.PVT_KEY_SECRET

      // Throw error if JWT_SECRET is not set
      if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined.')
      }

      // Check if config/keys exists or not
      if (!existsSync(keyDir)) {
        mkdirSync(keyDir, { recursive: true })
      }

      // Check if PUBLIC and PRIVATE KEY exists else generate new
      if (!existsSync(publicKeyPath) || !existsSync(privateKeyPath)) {
        const result = generateKeyPairSync('rsa', {
          modulusLength: 2048,
          publicKeyEncoding: {
            type: 'spki',
            format: 'pem',
          },
          privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
            cipher: 'aes-256-cbc',
            passphrase: JWT_SECRET,
          },
        })

        const { publicKey, privateKey } = result
        writeFileSync(`${keyDir}/rsa.pub`, publicKey, { flag: 'wx' })
        writeFileSync(`${keyDir}/rsa`, privateKey, { flag: 'wx' })
        Logger.warn('New public and private key generated.')
      }
    } catch (error) {
      Logger.error(error)
    }
  }
}
