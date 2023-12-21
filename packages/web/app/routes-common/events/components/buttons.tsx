import type { ButtonProps } from '@mantine/core'
import { Button, Grid, Group, Title } from '@mantine/core'
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react'
import type { PropsWithChildren, ReactNode } from 'react'

interface StepLayoutProps {
  prevButton: ReactNode
  nextButton: ReactNode
  title: string
}

export const StepLayout = ({
  prevButton,
  nextButton,
  title,
  children,
}: PropsWithChildren<StepLayoutProps>) => {
  return (
    <>
      <Title ta="center" order={2} size="h3" mb="xs">
        {title}
      </Title>
      {children}
      <Grid justify="center" mt="xl">
        <Grid.Col span={6}>{prevButton}</Grid.Col>
        <Grid.Col span={6}>
          <Group justify="right">{nextButton}</Group>
        </Grid.Col>
      </Grid>
    </>
  )
}

interface ProgressButtonProps {
  onClick?: () => void
  type?: 'button' | 'reset' | 'submit'
}

export const NextButton = (
  props: PropsWithChildren<ProgressButtonProps & ButtonProps>
) => {
  const { children, ...rest } = props

  const common = {
    'data-testid': 'next-button',
    mt: 'xs',
    rightSection: <IconArrowRight size={18} />,
    onClick: props.onClick,
  }

  return (
    <>
      <Button {...common} hiddenFrom="sm" size="xs" {...rest}>
        {children}
      </Button>
      <Button {...common} visibleFrom="sm" size="sm" {...rest}>
        {children}
      </Button>
    </>
  )
}

export const PrevButton = (
  props: PropsWithChildren<ProgressButtonProps & ButtonProps>
) => {
  const { children, ...rest } = props

  const common = {
    'data-testid': 'prev-button',
    mt: 'xs',
    leftSection: <IconArrowLeft size={18} />,
    onClick: props.onClick,
  }

  return (
    <>
      <Button {...common} hiddenFrom="sm" size="xs" {...rest}>
        {children}
      </Button>
      <Button {...common} visibleFrom="sm" size="sm" {...rest}>
        {children}
      </Button>
    </>
  )
}
