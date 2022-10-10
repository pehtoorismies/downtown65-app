// import { SESV2 } from 'aws-sdk'
import { SESV2 } from 'aws-sdk'

const ses = new SESV2({ apiVersion: '2019-09-27' })

interface SendEmail {
  subject: string
  body: {
    html: string
    text: string
  }
  to: string
  from: string
}

/*

const mapEventOptions = (eventDoc: any): IEventEmailOptions => {
  const date = format(new Date(eventDoc.date), 'dd.MM.yyyy (EEEE)', {
    locale: fi,
  });

  const type = eventDoc.type;
  const typeHeader = findType(type, EVENT_TYPES, EVENT_TYPES[0].title);

  return {
    title: eventDoc.title,
    eventUrl: `${clientDomain}/events/${eventDoc._id}`,
    creator: eventDoc.creator.nickname,
    date,
    typeHeader,
    type: type.toLowerCase(),
    description: eventDoc.description || 'ei tarkempaa kuvausta.',
    preferencesUrl: `${clientDomain}/preferences`,
  };
};
 */

export const sendEmail = async ({ subject, body, to, from }: SendEmail) => {
  try {
    const params: SESV2.Types.SendEmailRequest = {
      Content: {
        Simple: {
          Body: {
            Html: {
              Data: body.html,
              Charset: 'utf8',
            },
            Text: {
              Data: body.text,
              Charset: 'utf8',
            },
          },
          Subject: {
            Data: subject,
            Charset: 'utf8',
          },
        },
      },
      Destination: {
        ToAddresses: [to],
      },
      FromEmailAddress: from,
      // ReplyToAddresses: [from],
      ConfigurationSetName: 'Dt65Set',
    }
    await ses.sendEmail(params)

    return {
      success: true,
    }
  } catch (error) {
    console.error('SES error')
    console.error(error)
    return {
      success: false,
    }
  }
}
