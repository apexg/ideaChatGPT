export const USER_TOKEN = 'idea-token'

export const TOKEN_EXP = '60s'
export const MAX_AGE = 1209600

const JWT_SECRET_KEY: string | undefined = process.env.NEXT_PUBLIC_JWT_SECRET_KEY!

export function getJwtSecretKey(): string {
  if (!JWT_SECRET_KEY || JWT_SECRET_KEY.length === 0) {
    throw new Error('The environment variable JWT_SECRET_KEY is not set.')
  }

  return JWT_SECRET_KEY
}
