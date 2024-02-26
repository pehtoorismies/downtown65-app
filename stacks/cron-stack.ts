import { Cron, Function, use } from 'sst/constructs'
import type { StackContext } from 'sst/constructs'
import { ConfigStack } from './config-stack'
import { getDomainStage } from './support/get-domain-stage'

export const CronStack = ({ app, stack }: StackContext) => {
  const { AUTH_CLIENT_ID, AUTH_CLIENT_SECRET, AUTH_DOMAIN } = use(ConfigStack)

  const domainStage = getDomainStage(app.stage)

  if (domainStage.accountType === 'production') {
    const weeklyEmailFun = new Function(stack, 'WeeklyEmail', {
      handler: 'apps/backend/src/cron-send-weekly-email/lambda.handler',
      bind: [AUTH_CLIENT_ID, AUTH_CLIENT_SECRET, AUTH_DOMAIN],
      environment: {
        DOMAIN_NAME: domainStage.domainName,
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
}
