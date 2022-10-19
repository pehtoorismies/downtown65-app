/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/node" />

import type { Tuple, DefaultMantineColor } from '@mantine/core'

type ExtendedCustomColors = 'dtPink' | DefaultMantineColor

declare module '@mantine/core' {
  interface MantineThemeColorsOverride {
    colors: Record<ExtendedCustomColors, Tuple<string, 10>>
  }
}
