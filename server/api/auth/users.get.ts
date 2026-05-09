import { getUsers } from '../../utils/auth'

export default defineEventHandler(() => {
  return getUsers()
})
