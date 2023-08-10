export const getDomain = (stage: string): string =>
  stage === 'production' ? 'downtown65.events' : `${stage}.downtown65.events`
