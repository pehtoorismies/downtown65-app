export type Dt65Context = { extras: { nickname: string; scope: string } }

export const isDt65Context = (object: unknown): object is Dt65Context => {
  const context = (object as Dt65Context)['extras']

  if (!context.nickname || !context.scope) {
    return false
  }

  return true
}
