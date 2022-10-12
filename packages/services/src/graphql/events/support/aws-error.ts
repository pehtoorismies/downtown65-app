interface AWSError {
  name: string
}

export const isAWSError = (object: unknown): object is AWSError => {
  return typeof object === 'object' && object !== null && 'name' in object
}
