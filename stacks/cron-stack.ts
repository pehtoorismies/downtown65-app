import type { StackContext } from '@serverless-stack/resources'
import { Cron, Function, use } from '@serverless-stack/resources'
import { ConfigStack } from './config-stack'

export const CronStack = ({ stack }: StackContext) => {
  const { AUTH_CLIENT_ID, AUTH_CLIENT_SECRET, AUTH_DOMAIN } = use(ConfigStack)

  const weeklyEmailFun = new Function(stack, 'WeeklyEmail', {
    handler: 'services/functions/scheduled/send-weekly-email.main',
    config: [AUTH_CLIENT_ID, AUTH_CLIENT_SECRET, AUTH_DOMAIN],
  })

  new Cron(stack, 'WeeklyEmailCron', {
    // https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html
    schedule: 'cron(0 10 ? * MON *)',
    job: weeklyEmailFun,
    enabled: false,
  })
}
