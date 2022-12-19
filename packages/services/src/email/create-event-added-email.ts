import mjml2html from 'mjml'
import mustache from 'mustache'
import type { EmailBody } from '~/email/email-body'
import weeklyTemplate from '~/email/weekly-template.mjml'

export interface EmailableEvent {
  eventImageUrl: string
  eventUrl: string
  title: string
  subtitle: string
  date: string
  description: string
}

export const createEventAddedEmail = (event: EmailableEvent): EmailBody => {
  const mjmlTemplate = mustache.render(weeklyTemplate, event)
  const plain = `
    Kippis, 
    ${event.title}
    ${event.subtitle}
    ${event.date}
    Tarkastele tapahtumaa: ${event.eventUrl}
  
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
