import { Dt65Stack } from './Dt65Stack'
import { App } from '@serverless-stack/resources'

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
