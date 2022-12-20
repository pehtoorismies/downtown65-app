import Handlebars from 'handlebars'
import mjml2html from 'mjml'
import type { EmailBody } from './email-body'
import type { EmailableEvent } from './emailable-event'
import eventAdded from './event-added.mjml'

export const createEventAddedEmail = (event: EmailableEvent): EmailBody => {
  const template = Handlebars.compile(eventAdded)
  const mjmlTemplate = template(event)

  const plain = `
    Kippis, 
    ${event.title}
    ${event.subtitle}
    ${event.date}
    Tarkastele tapahtumaa: ${event.eventId}
  
    Admin terveisin, 
    Kyttäki
  `

  const mjml = mjml2html(mjmlTemplate)
  if (mjml.errors) {
    console.error(mjml.errors)
  }

  return {
    plain,
    html: mjml.html,
  }
}
