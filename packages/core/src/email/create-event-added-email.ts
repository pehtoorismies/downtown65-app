import Handlebars from 'handlebars'
import mjml2html from 'mjml'
import type { EmailBody } from './email-body'
import eventAdded from './event-added.mjml'

interface EmailParams {
  date: string
  description: string
  eventImageUrl: string
  eventUrl: string
  location: string
  preferencesUrl: string
  subtitle: string
  title: string
  facebookLogoUrl: string
}

export const createEventAddedEmail = (emailParams: EmailParams): EmailBody => {
  const handleBarsTemplate = Handlebars.compile(eventAdded)

  const plain = `
    Kippis, 
    ${emailParams.title}
    ${emailParams.subtitle}
    ${emailParams.date}
    Tarkastele tapahtumaa: ${emailParams.eventUrl}
  
    Admin terveisin, 
    Kyttäki
  `

  const mjmlTemplate = handleBarsTemplate(emailParams)
  const mjml = mjml2html(mjmlTemplate)
  if (mjml.errors) {
    console.error(mjml.errors)
  }

  return {
    plain,
    html: mjml.html,
  }
}
