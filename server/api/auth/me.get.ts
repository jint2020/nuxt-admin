import { resolveUserFromEvent } from '../../utils/auth-event'

export default defineEventHandler((event) => {
  const user = resolveUserFromEvent(event)

  if (!user) {
    return { user: null }
  }

  event.context.user = user
  event.context.role = user.role

  return { user }
})
