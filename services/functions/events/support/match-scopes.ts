export const matchScopes = (allowedScopes: string[]) => (scope: string) => {
  const scopeArray = scope.split(' ')

  for (const s of scopeArray) {
    if (allowedScopes.includes(s)) {
      return true
    }
  }

  return false
}
