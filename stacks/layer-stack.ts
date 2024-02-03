import * as lambda from 'aws-cdk-lib/aws-lambda'
import type { StackContext } from 'sst/constructs'

export const LayerStack = ({ stack }: StackContext) => {
  const sharpLayer = new lambda.LayerVersion(stack, 'AppLayer', {
    code: lambda.Code.fromAsset('stacks/layers/sharp'),
    // compatibleArchitectures: [lambda.Architecture.ARM_64],
  })

  stack.addOutputs({
    SHARP_LAYER_ARN: sharpLayer.layerVersionArn,
  })

  return {
    SHARP_LAYER: sharpLayer,
  }
}
