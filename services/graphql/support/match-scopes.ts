type AllowedScope =
  | 'openid'
  | 'profile'
  | 'read:events'
  | 'write:events'
  | 'read:users'
  | 'read:me'
  | 'write:me'

export const matchScopes =
  (allowedScopes: AllowedScope[]) =>
  (scope: string): boolean => {
    const scopeArray = scope.split(' ')

    for (const s of scopeArray) {
      if (allowedScopes.includes(s as AllowedScope)) {
        return true
      }
    }

    return false
  }
