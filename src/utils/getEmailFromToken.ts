import jwt from 'jsonwebtoken'

export const getEmailFromToken = (token: string) => {
  const decoded = jwt.decode(token) as Record<string, string>
  return decoded.email
}
