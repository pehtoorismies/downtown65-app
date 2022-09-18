import { App } from '@serverless-stack/resources'
import { Dt65Stack } from './dt65-stack'

export default function (app: App) {
  app.setDefaultFunctionProps({
    runtime: 'nodejs16.x',
    srcPath: 'services',
    bundle: {
      format: 'esm',
    },
  })
  app.stack(Dt65Stack)
}
