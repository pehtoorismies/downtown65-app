// import { getWeeklyEmail } from '~/email/get-weekly-email'
// import { sendEmail } from '~/email/send-email'
// import { getAuth0Management } from '../../support/auth0'

// const management = await getAuth0Management()

// const fetchWeeklyEmailSubscribers = async () => {
//   try {
//     const users = await management.getUsers({
//       fields: 'email,name',
//       search_engine: 'v3',
//       q: `user_metadata.subscribeWeeklyEmail:true`,
//     })
//
//     return users
//   } catch (error) {
//     console.error(error)
//     return []
//   }
// }

export const handler = async () => {
  // const { plain, html } = getWeeklyEmail({
  //   preferencesUrl: 'http/sdfsdsfd',
  //   events: [
  //     {
  //       subtitle: 'asdads',
  //       title: 'asdads',
  //       date: '11.11.2022',
  //       weekDay: '12',
  //       participantCount: 12,
  //       url: 'asd',
  //       type: 'kokoasd',
  //       typeHeader: 'Type header tässä',
  //     },
  //   ],
  // })
  // const result = await sendEmail({
  //   subject: 'Viikon tapahtumat',
  //   body: {
  //     html,
  //     text: plain,
  //   },
  //   to: 'pehtoorismies@gmail.com',
  //   from: `Kyttaki <kyttaki@downtown65.events>`,
  // })
  // const users = await fetchWeeklyEmailSubscribers()
  // console.log(users)
  // return result
}
