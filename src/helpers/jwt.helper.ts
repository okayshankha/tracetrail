import { resolve } from 'path'
import fs from 'fs'
import jwt, { JwtPayload } from 'jsonwebtoken'
import crypto from 'crypto'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { Logger } from '../core/logger'

export interface IJwtHelperConstructorPayload {
  SECRET_KEY?: string
  JWT_EXPIRY_SECS?: number
}

const DEFAULT_JWT_EXPIRY_SECS = 60 * 60

export default class JWTHelper {
  private SECRET_KEY: string
  private JWT_EXPIRY_SECS: number
  private keyDir = resolve(__dirname, '..', '..', '.tracetrail/keys')
  private publicKeyPath = resolve(`${this.keyDir}/rsa.pub`)
  private privateKeyPath = resolve(`${this.keyDir}/rsa`)
  private publicKey: Buffer
  private privateKey: Buffer

  constructor({
    SECRET_KEY = `SECRET_KEY_${Math.random().toString()}`,
    JWT_EXPIRY_SECS = DEFAULT_JWT_EXPIRY_SECS,
  }: IJwtHelperConstructorPayload) {
    this.SECRET_KEY = SECRET_KEY
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
    } catch (error: any) {
      Logger.error(error?.message ?? error)
    }
    return null
  }

  /**
   * Create a signed JWT with the rsa private key.
   * @returns token
   */
  GenerateToken(): string {
    return jwt.sign(
      { key: Math.random().toString() },
      { key: this.privateKey, passphrase: this.SECRET_KEY },
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
  GenerateKeys(retryCount = 0): void {
    try {
      const keyDir = this.keyDir
      const publicKeyPath = this.publicKeyPath
      const privateKeyPath = this.privateKeyPath

      const JWT_SECRET = this.SECRET_KEY

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
        const result = crypto.generateKeyPairSync('rsa', {
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
        writeFileSync(publicKeyPath, publicKey, { flag: 'wx' })
        writeFileSync(privateKeyPath, privateKey, { flag: 'wx' })
        Logger.warn(
          "New RSA key-pair has been generated. Don't worry, no action is needed from your end.",
        )
      }

      if (!VerifyExistingRSA(this.SECRET_KEY, privateKeyPath)) {
        fs.unlinkSync(publicKeyPath)
        fs.unlinkSync(privateKeyPath)

        if (retryCount < 5) {
          this.GenerateKeys(++retryCount)
        }
      }
    } catch (error) {
      Logger.error(error)
    }
  }
}

function VerifyExistingRSA(passphrase: string, privateKeyPath: string) {
  try {
    if (!existsSync(privateKeyPath)) {
      const errorMessage =
        "Private key doesn't exists in the specified path! If this issue persists then find a folder named .tracetrail in your root directory and delete it."
      Logger.warn(errorMessage)
      throw Error(errorMessage)
    }

    const encryptedPrivateKey = fs.readFileSync(privateKeyPath).toString()

    // Attempt to decrypt the private key with the passphrase
    crypto.createPrivateKey({
      key: encryptedPrivateKey,
      format: 'pem',
      passphrase,
    })

    return true
  } catch (error) {
    // If decryption fails, the passphrase is not valid
    return false
  }
}
