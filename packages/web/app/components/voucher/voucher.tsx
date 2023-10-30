import { Card } from '@mantine/core'
import type { PropsWithChildren } from 'react'
import { VoucherHeader } from './voucher-header'

export const Voucher = ({ children }: PropsWithChildren) => {
  return (
    <Card withBorder radius="md" shadow="xs" pt={0}>
      {children}
    </Card>
  )
}

Voucher.displayName = 'VoucherComponent'

Voucher.Header = VoucherHeader
Voucher.Content = ({ children }: PropsWithChildren) => {
  return <>{children}</>
}
