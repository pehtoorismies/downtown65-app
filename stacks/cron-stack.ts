import type { StackContext } from 'sst/constructs'
import { Cron, Function, use } from 'sst/constructs'
import { ConfigStack } from './config-stack'
import { getDomain } from './support/get-domain'

export const CronStack = ({ app, stack }: StackContext) => {
  const { AUTH_CLIENT_ID, AUTH_CLIENT_SECRET, AUTH_DOMAIN } = use(ConfigStack)

  const weeklyEmailFun = new Function(stack, 'WeeklyEmail', {
    handler: 'packages/services/src/functions/scheduled/send-weekly-email.main',
    bind: [AUTH_CLIENT_ID, AUTH_CLIENT_SECRET, AUTH_DOMAIN],
    environment: {
      DOMAIN_NAME: getDomain(app.stage),
    },
    permissions: ['ses:SendEmail', 'ses:SendRawEmail'],
  })

  new Cron(stack, 'WeeklyEmailCron', {
    // https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html
    schedule: 'cron(0 10 ? * MON *)',
    job: weeklyEmailFun,
    enabled: false,
  })
}
