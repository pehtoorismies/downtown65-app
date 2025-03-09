import { useUserContext } from '~/contexts/user-context'

export const useParticipantsCount = (
  participants: {
    id: string
  }[],
) => {
  const { user } = useUserContext()
  const meAttending =
    user != null && participants.map(({ id }) => id).includes(user.id)
  return {
    count: participants.length,
    meAttending,
  }
}
