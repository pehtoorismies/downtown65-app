import Handlebars from 'handlebars'
import mjml2html from 'mjml'
import type { EmailBody } from './email-body'
import weeklyEmail from './weekly-template.mjml'

interface EmailEvent {
  type: string
  url: string
  weekDay: string
  date: string
  title: string
  subtitle: string
  participantCount: number
  typeHeader: string
}

interface WeeklyMainProperties {
  events: EmailEvent[]
  preferencesUrl: string
}

const eventToPlain = ({ title, subtitle, weekDay, date, url }: EmailEvent) =>
  `
    ---
    ${title}
    ${subtitle}
    ${weekDay} ${date}
    Tarkastele tapahtumaa: ${url}
    
  `

export const getWeeklyEmail = (properties: WeeklyMainProperties): EmailBody => {
  const template = Handlebars.compile(weeklyEmail)

  const plain = `
    Kippis, 
    ${properties.events.map((emailEvent) => eventToPlain(emailEvent))}
  
    Admin terveisin, 
    Kyttäki
  `

  const mjml = mjml2html(template(properties))

  console.error(mjml.errors)

  return {
    plain,
    html: mjml.html,
  }
}
