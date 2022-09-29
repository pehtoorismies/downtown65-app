import { getAuth0Management } from '../../support/auth'

const fetchWeeklyEmailSubscribers = async () => {
  const management = await getAuth0Management()

  try {
    const users = await management.getUsers({
      fields: 'email,name',
      search_engine: 'v3',
      q: `user_metadata.subscribeWeeklyEmail:true`,
    })

    return users
  } catch (error) {
    console.error(error)
    return []
  }
}

export const main = async () => {
  const users = await fetchWeeklyEmailSubscribers()
  console.log(users)

  return {}
}
