import { SpamError } from 'remix-utils/honeypot/server'
import { honeypot } from '~/honeypot.server'
import { logger } from '~/util/logger.server'

type FormDataResponse =
  | {
      formData: FormData
      spam: false
    }
  | {
      type: string
      spam: true
    }

export const getFormData = async (
  request: Request,
): Promise<FormDataResponse> => {
  const type = request.headers.get('content-type')
  if (!type?.startsWith('application/x-www-form-urlencoded')) {
    return {
      type: 'Content-Type is not: application/x-www-form-urlencoded',
      spam: true,
    }
  }

  try {
    const formData = await request.formData()
    await honeypot.check(formData)

    return {
      formData,
      spam: false,
    }
  } catch (error) {
    if (error instanceof SpamError) {
      logger.info(error, 'Honeypot field filled')
      return {
        type: 'Honeypot field filled',
        spam: true,
      }
    }

    logger.info(error, 'Possible spam request detected')
    return {
      type: 'Cannot parse form data',
      spam: true,
    }
  }
}
