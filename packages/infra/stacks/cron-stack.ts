import type { StackContext } from '@serverless-stack/resources'
import { Cron, Function, use } from '@serverless-stack/resources'
import { ConfigStack } from './config-stack'

export const CronStack = ({ stack }: StackContext) => {
  const { AUTH_CLIENT_ID, AUTH_CLIENT_SECRET, AUTH_DOMAIN } = use(ConfigStack)

  const weeklyEmailFun = new Function(stack, 'WeeklyEmail', {
    srcPath: 'packages/services',
    handler: 'src/functions/scheduled/send-weekly-email.main',
    bind: [AUTH_CLIENT_ID, AUTH_CLIENT_SECRET, AUTH_DOMAIN],
    bundle: {
      nodeModules: ['uglify-js'],
      format: 'esm',
      loader: {
        '.mjml': 'text',
      },
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
