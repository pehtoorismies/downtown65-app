import type { StackContext } from '@serverless-stack/resources'
import * as lambda from 'aws-cdk-lib/aws-lambda'

export const LambdaLayerStack = ({ stack }: StackContext) => {
  const lambdaLayer = new lambda.LayerVersion(stack, 'AppLayer', {
    code: lambda.Code.fromAsset('packages/infra/layers/sharp'),
  })

  return {
    lambdaLayerArn: lambdaLayer.layerVersionArn,
  }
}
