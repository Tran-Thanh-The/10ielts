
export interface IUser {
  id: number
  email: string
  provider: string
  socialId: any
  fullName: string
  password?: string
  dob: string
  role: IRole
  status: string
  createdAt: string
  updatedAt: string
  deletedAt: any
}

export interface IRole {
  id: number
  name: string
  __entity: string
}
