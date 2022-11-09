export interface User {
  id: number
  email: string
  password: string
  created_on: string
  last_login: string | null
}

export interface UserWithId {
  id: number
  email: string
}
