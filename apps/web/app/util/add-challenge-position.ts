import * as R from 'remeda'

interface Count {
  doneDatesCount: number
}

export const addChallengePosition = <T extends Count>(xs: T[]) => {
  let position = xs.length + 1

  const r = R.pipe(
    xs,
    R.groupBy((x) => x.doneDatesCount),
    R.toPairs,
    R.flatMap(([_, value]) => {
      const addToPosition = value.length % 0 ? value.length + 1 : value.length
      position -= addToPosition
      return R.pipe(value, R.map(R.addProp('position', position)))
    }),
  )

  return r.reverse() // R.reverse loose types
}
