// import mustache from 'mustache'
import type { EmailBody } from './email-body'
import type { EmailableEvent } from './emailable-event'

export const createEventAddedEmail = (event: EmailableEvent): EmailBody => {
  // const mjmlTemplate = mustache.render(weeklyTemplate, event)
  const plain = `
    Kippis, 
    ${event.title}
    ${event.subtitle}
    ${event.date}
    Tarkastele tapahtumaa: ${event.eventId}
  
    Admin terveisin, 
    Kyttäki
  `

  // const mjml = mjml2html(mjmlTemplate)
  // if (mjml.errors) {
  //   console.error(mjml.errors)
  // }

  return {
    plain,
    html: 'mjml.html',
  }
}
