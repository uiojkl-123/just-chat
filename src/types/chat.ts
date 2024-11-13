import { User } from './user'

export interface IMessage {
  user: User
  content: string
  date: string
}
