import { logger } from '@downtown65-app/logger'
import { SESV2 } from 'aws-sdk'

const ses = new SESV2({ apiVersion: '2019-09-27' })

interface SendEmail {
  subject: string
  body: {
    html: string
    text: string
  }
  recipients: string[]
  bccRecipients: string[]
  from: string
}

export const sendEmail = async ({
  subject,
  body,
  recipients,
  bccRecipients,
  from,
}: SendEmail) => {
  try {
    const params: SESV2.Types.SendEmailRequest = {
      Content: {
        Simple: {
          Body: {
            Html: {
              Data: body.html,
              Charset: 'UTF-8',
            },
            Text: {
              Data: body.text,
              Charset: 'UTF-8',
            },
          },
          Subject: {
            Data: subject,
            Charset: 'UTF-8',
          },
        },
      },
      Destination: {
        ToAddresses: recipients,
        BccAddresses: bccRecipients,
      },
      FromEmailAddress: from,
      // ReplyToAddresses: [from],
      // ConfigurationSetName: 'Dt65Set',
    }

    await ses.sendEmail(params).promise()

    return {
      success: true,
    }
  } catch (error) {
    logger.error(error, 'SES error')
    return {
      success: false,
    }
  }
}
