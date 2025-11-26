export type Role = 'admin' | 'manager' | 'staff' | 'guest'
export interface Option {
  text: string
  value: string

}
export interface User {
  id: number | string
  name: string
  email?: string
  role: Role
  roleId: string
}