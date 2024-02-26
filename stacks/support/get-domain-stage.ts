type Production = {
  accountType: 'production'
  domainName: 'downtown65.events'
}

type Staging = {
  accountType: 'staging'
  domainName: `pr-${number}.staging.downtown65.events`
}

type Development = {
  accountType: 'dev'
}

type DomainStage = Production | Staging | Development

export const getDomainStage = (stage: string): DomainStage => {
  if (stage === 'production') {
    return {
      accountType: 'production',
      domainName: 'downtown65.events',
    }
  }
  if (stage.startsWith('pr-')) {
    const result = stage.match(/^pr-(?<prId>\d+)$/)
    if (result?.groups == null) {
      throw new Error(`Malformatted stage: ${stage}. Use: pr-<pr-id>`)
    }
    if (result.groups['prId'] == null) {
      throw new Error(`Malformatted stage pr-id: ${stage}. Use: pr-<pr-id>`)
    }
    const prId = Number(result.groups['prId'])

    return {
      accountType: 'staging',
      domainName: `pr-${prId}.staging.downtown65.events`,
    }
  }
  return {
    accountType: 'dev',
  }
}
