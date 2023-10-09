import { Container, createTheme, rem } from '@mantine/core'

const CONTAINER_SIZES: Record<string, string> = {
  xxs: rem(300),
  xs: rem(540),
  sm: rem(720),
  md: rem(960),
  lg: rem(1140),
  xl: rem(1320),
}

export const theme = createTheme({
  breakpoints: {
    xs: '30em',
    sm: '48em',
    md: '64em',
    lg: '74em',
    xl: '90em',
  },
  colors: {
    dtPink: [
      '#F7D9F2',
      '#F6AFEA',
      '#FF80EA', // original
      '#EE6AD9',
      '#DB5BC6',
      '#C751B3',
      '#B14AA0',
      '#964C8A',
      '#804B78',
      '#804B78',
    ],
  },
  defaultGradient: { from: 'indigo', to: 'cyan', deg: 45 },
  shadows: {
    md: '1px 1px 3px rgba(0, 0, 0, .25)',
    xl: '5px 5px 3px rgba(0, 0, 0, .25)',
  },

  components: {
    Container: Container.extend({
      vars: (_, { size, fluid }) => ({
        root: {
          '--container-size': fluid
            ? '100%'
            : size !== undefined && size in CONTAINER_SIZES
            ? CONTAINER_SIZES[size]
            : rem(size),
        },
      }),
    }),
  },
  headings: {
    fontFamily: 'Roboto, sans-serif',
    sizes: {
      h1: { fontSize: '2rem' },
    },
  },
})
